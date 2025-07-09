import * as Client from "../client";
import { hexToString } from "../parse/utils";
import { parseTransactionType } from "../parse/transaction";
import { getNativeCurrency } from "../client";
import { removeUndefined } from "../common";
import { AMM_LP_TOKEN_REGEX } from "../models/amm_info";

const maxLength = 16; // Maximum length of a currency string

export async function parseCurrencyInformation(
  currency: any
): Promise<null | DecodeHexCurrencyInterface | DecodedNFTCurrencyInterface> {
  if (!currency || typeof currency !== "string") {
    return null;
  }

  if (currency.length < 3) {
    return null;
  }

  if (currency.length === 3 && currency.trim().toUpperCase() !== getNativeCurrency()) {
    return decodeSimple(currency);
  }

  if (isHex(currency)) {
    return await decodeCurrencyHex(currency);
  }

  return null;
}

interface DecodeSimpleCurrencyInterface {
  type: string;
  currencyCode: string;
  currency: string;
}

function decodeSimple(currencyCode: string): DecodeSimpleCurrencyInterface {
  return {
    type: "simple",
    currencyCode,
    currency: currencyCode.trim(),
  };
}

async function decodeCurrencyHex(
  currencyCode: string
): Promise<null | DecodeHexCurrencyInterface | DecodedNFTCurrencyInterface> {
  const prefix = currencyCode.substring(0, 2);

  if (prefix === "02" && isXlf15d(currencyCode)) {
    return await decodeXlf15d(currencyCode);
  } else if (AMM_LP_TOKEN_REGEX.test(currencyCode)) {
    return decodeLPTokenHex(currencyCode);
  } else {
    return decodeHex(currencyCode);
  }
}

interface DecodedNFTCurrencyInterface {
  type: string;
  currencyCode: string;
  currency: string;
  cti: number;
  ctiLedger: number;
  ctiTxIndex: number;
  ctiValid: boolean;
  ctiVerified: boolean;
  timestamp?: number;
  ctiTx: DecodedNFTCurrencyTransactionInterface;
}

interface DecodedNFTCurrencyTransactionInterface {
  type?: string;
  account?: string;
  destination?: string;
  issuer?: string;
  counterparty?: string; // @deprecated, use issuer
  hash?: string;
  memos?: string;
}

async function decodeXlf15d(currencyCode: string): Promise<DecodedNFTCurrencyInterface> {
  const hex = currencyCode.toString().replace(/(00)+$/g, "");
  const ctiHex = hex.substring(2, 16);
  const cti = BigInt("0x" + ctiHex); // eslint-disable-line prefer-template
  const ctiLedger = Number(ctiLedgerIndex(cti));
  const ctiTxIndex = Number(ctiTransactionIndex(cti));
  const currencyHex = hex.substring(16, hex.length);
  const currency = hexToString(currencyHex)?.trim()?.replace(/\0/g, "") as string;
  const ledgerInfo = await getLedger(ctiLedger);
  const ledger = ledgerInfo?.ledger;

  let ctiVerified = false;
  let ctiValid = false;
  let timestamp: number | undefined;
  let ctiTx: DecodedNFTCurrencyTransactionInterface = {};

  if (ledger) {
    timestamp = Math.round(new Date(ledger.close_time_human).getTime() / 1000);

    for (const transaction of ledger.transactions) {
      if (transaction.metaData.TransactionIndex === ctiTxIndex) {
        const {
          Account: account,
          Destination: destination,
          LimitAmount: limit,
          Memos: memos,
          hash: hash,
        } = transaction;
        const type = parseTransactionType(transaction.TransactionType);

        ctiTx = removeUndefined({
          type,
          account,
          destination,
          issuer: limit?.issuer,
          counterparty: limit?.issuer, // @deprecated, use issuer
          hash,
          memos,
        });

        break;
      }
    }
  }

  if (ledger) {
    ctiVerified = true;

    if (ctiTx.hash) {
      ctiValid =
        ctiLedgerCheck(cti) === ctiLedgerCheckGen(ledger.hash || ledger.ledger_hash) &&
        ctiTransactionCheck(cti) === ctiTransactionCheckGen(ctiTx.hash);
    }
  } else if (ledgerInfo?.error === "lgrNotFound") {
    ctiVerified = true;
  }

  return {
    type: "nft",
    currencyCode,
    currency,
    cti: Number(cti),
    ctiLedger,
    ctiTxIndex,
    ctiValid,
    ctiVerified,
    timestamp,
    ctiTx,
  };
}

interface DecodeHexCurrencyInterface {
  type: string;
  currencyCode: string;
  currency: string;
}

function decodeHex(currencyHex: string): DecodeHexCurrencyInterface | null {
  const decodedHex = hexToString(currencyHex)?.slice(0, maxLength)?.trim() as string;
  if (decodedHex.match(/[a-zA-Z0-9]{3,}/) && decodedHex.toUpperCase() !== getNativeCurrency()) {
    return {
      type: "hex",
      currencyCode: currencyHex,
      currency: decodedHex.trim().replace(/\0/g, ""),
    };
  }

  return null;
}

function decodeLPTokenHex(currencyHex: string): DecodeHexCurrencyInterface | null {
  return {
    type: "lp_token",
    currencyCode: currencyHex,
    currency: "LP Token",
  };
}

async function getLedger(ledgerIndex: number): Promise<any> {
  let ledgerInfo: any = null;
  try {
    ledgerInfo = await Client.getLedger({ ledgerIndex, transactions: true, expand: true });
  } catch (_err: any) {
    // Ignore
  }

  return ledgerInfo;
}

function ctiTransactionIndex(cti: bigint): bigint {
  // eslint-disable-next-line no-bitwise
  return (cti >> 32n) & 0xffffn;
}

function ctiLedgerIndex(cti: bigint): bigint {
  // eslint-disable-next-line no-bitwise
  return cti & 0xffffffffn;
}

function ctiLedgerCheck(cti: bigint): bigint {
  // eslint-disable-next-line no-bitwise
  return (cti >> 52n) & 0xfn;
}

function ctiTransactionCheck(cti: bigint): bigint {
  // eslint-disable-next-line no-bitwise
  return (cti >> 48n) & 0xfn;
}

function ctiLedgerCheckGen(ledgerHash: string): bigint {
  return BigInt(parseInt(ledgerHash.slice(0, 1), 16));
}

function ctiTransactionCheckGen(txHash: string): bigint {
  return BigInt(parseInt(txHash.slice(0, 1), 16));
}

function isXlf15d(currencyHex: string): boolean {
  const hex = currencyHex.toString().replace(/(00)+$/g, "");

  const xlf15d = Buffer.from(hex, "hex").slice(8).toString("utf-8").slice(0, maxLength).trim();
  if (xlf15d.match(/[a-zA-Z0-9]{3,}/) && xlf15d.toUpperCase() !== getNativeCurrency()) {
    return true;
  }

  return false;
}

function isHex(currencyCode: string): boolean {
  return !!currencyCode.match(/^[a-fA-F0-9]{40}$/) && !isNaN(parseInt(currencyCode, 16));
}
