import BigNumber from "bignumber.js";
import omitBy from "lodash/omitBy";
import * as Crypto from "crypto";
import { Wallet, Transaction, ValidationError, validate, ECDSA } from "xrpl";
import { isValidXAddress, xAddressToClassicAddress, decodeSeed } from "ripple-address-codec";
import {
  encodeForSigning,
  encodeForMultisigning,
  encode,
  decode,
  XrplDefinitionsBase,
  XrplDefinitions,
  DEFAULT_DEFINITIONS,
} from "ripple-binary-codec";
import { sign, verify, deriveKeypair, deriveAddress } from "ripple-keypairs";

import * as Base58 from "./base58";
import { sha512Half } from "./common";

enum HashPrefix {
  // transaction plus signature to give transaction ID 'TXN'
  TRANSACTION_ID = 0x54584e00,
}

interface GenerateAddressInterface {
  publicKey: string;
  privateKey: string;
  address: string;
  seed: string;
}

export function isValidSecret(secret: string): boolean {
  try {
    deriveKeypair(secret);
    return true;
  } catch (_err: any) {
    // Ignore error
  }

  return false;
}

export interface WalletFromSeedInterface {
  masterAddress?: string; // master address to use for wallet can be different from seedAddress for multisign
  algorithm?: ECDSA; // algorithm to use for wallet in case seed is without payload
  seedAddress?: string; // classic address required to check if seed is secp256k1
  ignoreSeedPayload?: boolean; // ignore seed payload pre check and consider it as ed25519
}

export function walletFromSeed(seed: string, options?: WalletFromSeedInterface): Wallet {
  options = { ignoreSeedPayload: false, ...options }; // eslint-disable-line no-param-reassign
  let algorithm: ECDSA | undefined = options.algorithm;

  if (!options.ignoreSeedPayload && !options.algorithm) {
    const decodedSeed = decodeSeed(seed);
    if (decodedSeed.type === "secp256k1") {
      // NOTE: can be either secp256k1 or ed25519, rippled generates ed25519 seeds without payload

      // if address is provided, check if it's secp256k1
      if (options.seedAddress) {
        const { publicKey } = deriveKeypair(seed, { algorithm: ECDSA.secp256k1 });
        const classicAddress = deriveAddress(publicKey);
        if (classicAddress === options.seedAddress) {
          algorithm = ECDSA.secp256k1;
        } else {
          algorithm = ECDSA.ed25519;
        }
      } else {
        algorithm = ECDSA.secp256k1;
      }
    }
  }

  // NOTE: Wallet by default consider seed without payload as ed25519
  const wallet = Wallet.fromSeed(seed, { algorithm, masterAddress: options.masterAddress });

  return wallet;
}

export function generateAddress(): GenerateAddressInterface {
  const wallet = Wallet.generate();
  const { publicKey, privateKey, classicAddress, seed } = wallet;

  return { publicKey, privateKey, address: classicAddress, seed: seed as string };
}

export function isValidClassicAddress(address: string): boolean {
  if (!address || address.length === 0) {
    return false;
  }

  const buffer = Base58.decode(address);
  if (buffer === null) {
    return false;
  }

  const checksum: Buffer = checksumClassicAddress(buffer);
  if (
    checksum[0] !== buffer[21] ||
    checksum[1] !== buffer[22] ||
    checksum[2] !== buffer[23] ||
    checksum[3] !== buffer[24]
  ) {
    return false;
  }

  return true;
}

export function checksumClassicAddress(buffer: Buffer): Buffer {
  const hash: Buffer = buffer.slice(0, 21);
  const checksumPrepare: Buffer = Crypto.createHash("sha256").update(Buffer.from(hash)).digest();
  const checksum: Buffer = Crypto.createHash("sha256").update(checksumPrepare).digest();

  return checksum;
}

/**
 * Signs a transaction offline.
 *
 * @param wallet - A Wallet.
 * @param transaction - A transaction to be signed offline.
 * @param multisign - Specify true/false to use multisign or actual address (classic/x-address) to make multisign tx request.
 * @returns A signed transaction.
 * @throws ValidationError if the transaction is already signed or does not encode/decode to same result.
 * @throws XrplError if the issued currency being signed is XRP ignoring case.
 */
export function signTransaction(
  wallet: Wallet,
  transaction: Transaction,
  multisign?: boolean | string,
  definitions?: XrplDefinitionsBase,
  validateTx?: boolean
): {
  tx_blob: string;
  hash: string;
} {
  let multisignAddress: boolean | string = false;
  if (typeof multisign === "string" && multisign.startsWith("X")) {
    multisignAddress = multisign;
  } else if (multisign) {
    multisignAddress = wallet.classicAddress;
  }

  // clean null & undefined valued tx properties
  // eslint-disable-next-line
  const tx = omitBy({ ...transaction }, (value) => value == null) as unknown as Transaction;

  if (tx.TxnSignature || tx.Signers) {
    throw new ValidationError('txJSON must not contain "TxnSignature" or "Signers" properties');
  }

  removeTrailingZeros(tx);

  /*
   * This will throw a more clear error for JS users if the supplied transaction has incorrect formatting
  NOTE: it does not support Xahau txs yet
   */
  // eslint-disable-next-line
  if (validateTx !== false) {
    validate(tx as unknown as Record<string, unknown>);
  }

  const txToSignAndEncode = { ...tx };

  txToSignAndEncode.SigningPubKey = multisignAddress ? "" : wallet.publicKey;

  if (multisignAddress) {
    const signer = {
      Account: multisignAddress,
      SigningPubKey: wallet.publicKey,
      TxnSignature: computeSignature(txToSignAndEncode, wallet.privateKey, multisignAddress, definitions),
    };
    txToSignAndEncode.Signers = [{ Signer: signer }];
  } else {
    txToSignAndEncode.TxnSignature = computeSignature(txToSignAndEncode, wallet.privateKey, undefined, definitions);
  }

  const serialized = encode(txToSignAndEncode, definitions);
  return {
    tx_blob: serialized,
    hash: hashSignedTx(serialized, definitions),
  };
}

/**
 * Verifies a signed transaction offline.
 *
 * @param signedTransaction - A signed transaction (hex string of signTransaction result) to be verified offline.
 * @returns Returns true if a signedTransaction is valid.
 */
export function verifyTransaction(wallet: Wallet, signedTransaction: Transaction | string): boolean {
  const tx = typeof signedTransaction === "string" ? decode(signedTransaction) : signedTransaction;
  const messageHex: string = encodeForSigning(tx);
  const signature = tx.TxnSignature as string;
  return verify(messageHex, signature, wallet.publicKey);
}

/**
 * Signs a transaction with the proper signing encoding.
 *
 * @param tx - A transaction to sign.
 * @param privateKey - A key to sign the transaction with.
 * @param signAs - Multisign only. An account address to include in the Signer field.
 * Can be either a classic address or an XAddress.
 * @returns A signed transaction in the proper format.
 */
function computeSignature(
  tx: Transaction,
  privateKey: string,
  signAs?: string,
  definitions?: XrplDefinitionsBase
): string {
  if (signAs) {
    const classicAddress = isValidXAddress(signAs) ? xAddressToClassicAddress(signAs).classicAddress : signAs;
    return sign(encodeForMultisigning(tx, classicAddress, definitions), privateKey);
  }
  return sign(encodeForSigning(tx, definitions), privateKey);
}

/**
 * Remove trailing insignificant zeros for non-XRP Payment amount.
 * This resolves the serialization mismatch bug when encoding/decoding a non-XRP Payment transaction
 * with an amount that contains trailing insignificant zeros; for example, '123.4000' would serialize
 * to '123.4' and cause a mismatch.
 *
 * @param tx - The transaction prior to signing.
 */
function removeTrailingZeros(tx: Transaction): void {
  if (
    tx.TransactionType === "Payment" &&
    typeof tx.Amount !== "string" &&
    tx.Amount.value.includes(".") &&
    tx.Amount.value.endsWith("0")
  ) {
    // eslint-disable-next-line no-param-reassign -- Required to update Transaction.Amount.value
    tx.Amount = { ...tx.Amount };
    // eslint-disable-next-line no-param-reassign -- Required to update Transaction.Amount.value
    tx.Amount.value = new BigNumber(tx.Amount.value).toString();
  }
}

/**
 * Hashes the Transaction object as the ledger does. Throws if the transaction is unsigned.
 *
 * @param tx - A transaction to hash. Tx may be in binary blob form. Tx must be signed.
 * @returns A hash of tx.
 * @throws ValidationError if the Transaction is unsigned.\
 * @category Utilities
 */
function hashSignedTx(tx: Transaction | string, definitions?: XrplDefinitionsBase, validateTx?: boolean): string {
  let txBlob: string;
  let txObject: Transaction;
  if (typeof tx === "string") {
    txBlob = tx;
    // eslint-disable-next-line
    txObject = decode(tx, definitions) as unknown as Transaction;
  } else {
    txBlob = encode(tx, definitions);
    txObject = tx;
  }

  if (validateTx !== false) {
    if (txObject.TxnSignature === undefined && txObject.Signers === undefined) {
      throw new ValidationError("The transaction must be signed to hash it.");
    }
  }

  const prefix = HashPrefix.TRANSACTION_ID.toString(16).toUpperCase();
  return sha512Half(prefix.concat(txBlob));
}

// export XrplDefinitionsBase for custom definitions, in case old binary codec is used
export { XrplDefinitionsBase, XrplDefinitions, DEFAULT_DEFINITIONS, hashSignedTx };
