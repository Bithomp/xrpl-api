import * as Client from "../client";
import { hexToString } from "../parse/utils";
import { parseTransactionType } from "../parse/transaction";
import { getNativeCurrency } from "../client";
import { removeUndefined } from "../common";
import { AMM_LP_TOKEN_REGEX } from "../models/amm_info";

const maxLength = 20; // Maximum length of a currency string

const DECODED_HEX_CURRENCY_REGEX = /[^-\w\(\)\[\]\u0020-\u007E\u00A0-\uFFFF]*/g;

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
  } else if (prefix === "03" && AMM_LP_TOKEN_REGEX.test(currencyCode)) {
    return decodeLPTokenHex(currencyCode);
  } else if (prefix === "01" && isDemurrageHex(currencyCode)) {
    return decodeDemurrageHex(currencyCode);
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
  let hex = currencyHex;
  const prefix = currencyHex.substring(0, 2);
  if (prefix === "02") {
    hex = currencyHex.substring(16, currencyHex.length);
  }

  const decoded = hexToString(hex)
    ?.slice(0, maxLength)
    ?.replace(/^\u0000+/, "") // remove leading null characters
    ?.replace(/\u0000+$/, "") // remove trailing null characters
    ?.trim() as string;

  // remove all not printable characters, zero-width space, and multiple spaces
  const trimmed = decoded
    .replace(DECODED_HEX_CURRENCY_REGEX, "") // remove all not printable characters
    .replace(/[�]*/g, "") // remove replacement character
    .replace(/\s+/g, " ") // replace multiple spaces with a single space
    .trim();

  if (
    trimmed.length > 1 && // at least 2 characters
    trimmed.length >= decoded.length / 2 && // more than half of the decoded string
    trimmed.toUpperCase() !== getNativeCurrency()
  ) {
    return {
      type: "hex",
      currencyCode: currencyHex,
      currency: trimmed,
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

/**
 * @deprecated demurrage/interest-bearing
 *
 * Decode a demurrage currency hex string.
 * This function extracts the currency code, interest rate, and other details from the hex string.
 * It returns an object containing the type, currency code, and formatted currency string.
 * * @param {string} currencyHex - The hex string representing the demurrage currency.
 * @returns {DecodeHexCurrencyInterface | null} - An object with the type, currency code, and formatted currency string, or null if the input is invalid.
 *
 * https://ripple.github.io/ripple-demurrage-tool/
 * https://github.com/ripple/ripple-demurrage-tool/blob/master/demudemo.js
 * https://github.com/XRPLF/xrpl.js/blob/0.11.0/src/js/ripple/currency.js
 */
function decodeDemurrageHex(currencyHex: string): DecodeHexCurrencyInterface | null {
  const hex = currencyHex.substring(2, 8);
  const currencyText = hexToString(hex)?.trim()?.replace(/\0/g, "") as string;
  let valuePrefix = "";

  const year = 31536000;
  const decimals = 2;

  const interestPeriod = hex2double(currencyHex.substring(16, 32));
  const interest = Math.exp(year / interestPeriod);

  // prettier-ignore
  const percentage = (interest * 100) - 100;
  const decimalMultiplier = decimals ? Math.pow(10, decimals) : 100;
  const rate = Math.round(percentage * decimalMultiplier) / decimalMultiplier;

  valuePrefix = `(${rate > 0 ? "+" : ""}${rate}%pa)`;

  const currency = `${currencyText} ${valuePrefix}`;

  return {
    type: "demurrage",
    currencyCode: currencyHex,
    currency,
  };
}

function isDemurrageHex(currencyHex: string): boolean {
  const hex = currencyHex.substring(2, 8);
  const currencyText = hexToString(hex)?.trim()?.replace(/\0/g, "") as string;

  if (!currencyText || currencyText.length < 3) {
    return false;
  }

  // a-zA-Z0-9 are allowed, but not special characters
  if (!currencyText.match(/^[a-zA-Z0-9\s]+$/)) {
    return false;
  }

  const interestPeriod = hex2double(currencyHex.substring(16, 32));
  if (isNaN(interestPeriod)) {
    return false;
  }

  const interestStart = Buffer.from(currencyHex.substring(8, 16), "hex").readUInt32BE(0);
  if (isNaN(interestStart) || interestStart < 0) {
    return false;
  }

  return true;
}

function hex2double(hex: string): number {
  const buffer = Buffer.from(hex, "hex");
  const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  return view.getFloat64(0, false); // false for big-endian
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
