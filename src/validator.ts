import * as assert from "assert";
import { encodeAccountID, decodeNodePublic, encodeNodePublic, codec } from "ripple-address-codec";
import * as Crypto from "crypto";
import elliptic from "elliptic";
const secp256k1 = new elliptic.ec("secp256k1");
const ed25519 = new elliptic.eddsa("ed25519");
import * as rippleKeypairs from "ripple-keypairs";

import { bytesToHex } from "./parse/utils";

const DER_PRIVATE_KEY_PREFIX = Buffer.from("302E020100300506032B657004220420", "hex");
const DER_PUBLIC_KEY_PREFIX = Buffer.from("302A300506032B6570032100", "hex");
const VALIDATOR_HEX_PREFIX_ED25519 = "ED";
const VALIDATOR_NODE_PUBLIC_KEY_PREFIX = "n";

// xrpl_address_from_validator_pk
export function classicAddressFromValidatorPK(pk: string | Buffer): string | null {
  let pubkey = pk;
  if (typeof pk === "string") {
    pubkey = Buffer.from(decodeNodePublic(pk).buffer);
  }

  assert.ok(pubkey.length === 33);
  assert.ok(Crypto.getHashes().includes("sha256"));
  assert.ok(Crypto.getHashes().includes("ripemd160"));

  const pubkeyInnerHash = Crypto.createHash("sha256").update(pubkey);
  const pubkeyOuterHash = Crypto.createHash("ripemd160");
  pubkeyOuterHash.update(pubkeyInnerHash.digest());
  const accountID = pubkeyOuterHash.digest();

  return encodeAccountID(accountID);
}

export interface GenerateSecretsInterface {
  key_type: string; // "ed25519"
  secret_key: string; // base58 encoded private key
  public_key: string; // node public key
  PublicKey: string; // hex public key
}

export function generateSecrets(): GenerateSecretsInterface {
  const keypair = Crypto.generateKeyPairSync("ed25519", {
    privateKeyEncoding: { format: "der", type: "pkcs8" },
    publicKeyEncoding: { format: "der", type: "spki" },
  });

  const { privateKey, publicKey } = keypair;

  const PublicKey =
    VALIDATOR_HEX_PREFIX_ED25519 +
    publicKey.slice(DER_PUBLIC_KEY_PREFIX.length, publicKey.length).toString("hex").toUpperCase();

  const secretKey = codec.encode(privateKey.slice(DER_PRIVATE_KEY_PREFIX.length, privateKey.length), {
    versions: [0x20],
    expectedLength: 32,
  });

  return {
    key_type: "ed25519",
    secret_key: secretKey,
    public_key: encodeNodePublic(Buffer.from(PublicKey, "hex")),
    PublicKey,
  };
}

export function sign(message: Buffer | string, secret: string): string {
  if (typeof message === "string") {
    message = Buffer.from(message, "utf8"); // eslint-disable-line no-param-reassign
  }

  try {
    const decoded = codec.decode(secret, { versions: [0x20] });
    secret = VALIDATOR_HEX_PREFIX_ED25519 + bytesToHex(decoded.bytes.buffer); // eslint-disable-line no-param-reassign
  } catch (_err: any) {
    // ignore
  }

  return rippleKeypairs.sign(message.toString("hex"), secret).toUpperCase();
}

export function verify(message: Buffer | string, signature: string, publicKey: string): boolean {
  if (typeof message === "string") {
    message = Buffer.from(message, "utf8"); // eslint-disable-line no-param-reassign
  }

  // assume node public address as ed25519 key
  if (publicKey.slice(0, 1) === VALIDATOR_NODE_PUBLIC_KEY_PREFIX) {
    const publicKeyBuffer = decodeNodePublic(publicKey);
    publicKey = bytesToHex(publicKeyBuffer.buffer); // eslint-disable-line no-param-reassign
  }

  try {
    return rippleKeypairs.verify(message.toString("hex"), signature, publicKey);
  } catch (_err: any) {
    // ignore
  }

  return false;
}

export function verify2(message: Buffer, signature: string, publicKey: string): boolean {
  // assume node public address as ed25519 key
  if (publicKey.slice(0, 1) === VALIDATOR_NODE_PUBLIC_KEY_PREFIX) {
    const publicKeyBuffer = decodeNodePublic(publicKey);
    publicKey = bytesToHex(publicKeyBuffer.buffer); // eslint-disable-line no-param-reassign
  }

  if (publicKey.slice(0, 2) === VALIDATOR_HEX_PREFIX_ED25519) {
    const verifyKey = ed25519.keyFromPublic(publicKey.slice(2), "hex");
    if (verifyKey.verify(message.toString("hex"), signature)) {
      return true;
    }
  } else {
    const computedHash = Crypto.createHash("sha512").update(message).digest().toString("hex").slice(0, 64);
    const verifyKey = secp256k1.keyFromPublic(publicKey, "hex");

    if (verifyKey.verify(computedHash, signature)) {
      return true;
    }
  }

  return false;
}
