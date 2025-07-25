import _ from "lodash";
import { Transaction, TransactionMetadata } from "xrpl";
import { XrplDefinitionsBase } from "ripple-binary-codec";
import { parseTransaction, FormattedSpecification, FormattedTransaction } from "../parse/transaction";
export { FormattedTransaction } from "../parse/transaction";
import { Outcome } from "../types/outcome";

const CTID_REGEX = /^[cC]{1}[a-fA-F0-9]{15}$/;

export interface TransactionBaseResponse {
  /** The SHA-512 hash of the transaction. */
  hash: string;
  /** The ledger index of the ledger that includes this transaction. */
  ledger_index?: number;
  /** Transaction metadata, which describes the results of the transaction. */
  meta?: TransactionMetadata | string;
  /**
   * If true, this data comes from a validated ledger version; if omitted or.
   * Set to false, this data is not final.
   */
  validated?: boolean;
  /**
   * This number measures the number of seconds since the "Ripple Epoch" of January 1, 2000 (00:00 UTC)
   */
  date?: number;

  balanceChanges?: any[];
  specification?: FormattedSpecification;
  outcome?: Outcome;
  rawTransaction?: string;
}

export type TransactionResponse = TransactionBaseResponse & Transaction;
export type AccountTransaction = { tx: TransactionResponse; meta: TransactionMetadata; validated: boolean };
export type LedgerTransaction = TransactionBaseResponse & { metaData?: TransactionMetadata };
export type StreamTransaction = TransactionBaseResponse & {
  transaction: TransactionResponse;
  meta: TransactionMetadata;
};

export interface AccountPaymentParamsInterface {
  fee?: string;
  sequence?: number;
  lastLedgerSequence?: number;
  networkID?: number;
}

export function getTxDetails(
  tx: TransactionResponse,
  includeRawTransaction?: boolean,
  nativeCurrency?: string,
  definitions?: XrplDefinitionsBase
): FormattedTransaction {
  return parseTransaction(tx, includeRawTransaction, nativeCurrency, definitions);
}

export function getAccountTxDetails(
  tx: AccountTransaction,
  includeRawTransaction?: boolean,
  nativeCurrency?: string
): FormattedTransaction {
  return getTxDetails(accountTxToTx(tx), includeRawTransaction, nativeCurrency);
}

export function getLedgerTxDetails(
  tx: LedgerTransaction,
  ledgerIndex: number,
  closeTime: number,
  includeRawTransaction?: boolean,
  nativeCurrency?: string,
  definitions?: XrplDefinitionsBase
): FormattedTransaction {
  return getTxDetails(ledgerTxToTx(tx, ledgerIndex, closeTime), includeRawTransaction, nativeCurrency, definitions);
}

export function getStreamTxDetails(
  tx: StreamTransaction,
  includeRawTransaction?: boolean,
  nativeCurrency?: string,
  definitions?: XrplDefinitionsBase
): FormattedTransaction {
  return getTxDetails(streamTxToTx(tx), includeRawTransaction, nativeCurrency, definitions);
}

export function accountTxToTx(accountTx: AccountTransaction): TransactionResponse {
  return Object.assign({}, accountTx.tx, { meta: accountTx.meta, validated: accountTx.validated });
}

export function ledgerTxToTx(ledgerTx: LedgerTransaction, ledgerIndex: number, closeTime: number): TransactionResponse {
  const tx = _.omit(ledgerTx, "metaData") as TransactionResponse;

  return Object.assign({}, tx, {
    meta: ledgerTx.metaData,
    date: closeTime,
    ledger_index: ledgerIndex,
    validated: true,
  });
}

export function streamTxToTx(streamTx: StreamTransaction): TransactionResponse {
  return Object.assign({}, streamTx.transaction, {
    meta: streamTx.meta,
    ledger_index: streamTx.ledger_index,
    validated: streamTx.validated,
  });
}

export function isCTID(ctid: string | bigint): boolean {
  let ctidValue: bigint;
  if (typeof ctid === "string") {
    if (!CTID_REGEX.test(ctid)) {
      return false;
    }

    // eslint-disable-next-line prefer-template
    ctidValue = BigInt("0x" + ctid);
  } else if (typeof ctid === "bigint") {
    ctidValue = ctid;
  } else {
    return false;
  }

  // eslint-disable-next-line no-bitwise
  if (ctidValue > 0xffffffffffffffffn || (ctidValue & 0xf000000000000000n) !== 0xc000000000000000n) {
    return false;
  }

  return true;
}

export function encodeCTIDforTransaction(transaction: TransactionResponse, networkID: number): string | undefined {
  let ledgerIndex: number | undefined;
  if (transaction.ledger_index) {
    ledgerIndex = transaction.ledger_index;
  } else if (transaction.tx && (transaction.tx as any).ledger_index) {
    ledgerIndex = (transaction.tx as any).ledger_index;
  } else if (transaction.tx_json && (transaction.tx_json as any).ledger_index) {
    ledgerIndex = (transaction.tx_json as any).ledger_index;
  }

  if (typeof ledgerIndex !== "number") {
    return undefined;
  }

  const meta = (transaction.meta || transaction.metaData) as TransactionMetadata;
  if (!meta || !meta.TransactionIndex) {
    return undefined;
  }

  if (typeof networkID !== "number") {
    return undefined;
  }

  return encodeCTID(ledgerIndex, meta.TransactionIndex, networkID);
}

/**
 * @param {number} ledgerIndex - The ledger sequence number.
 * @param {number} txIndex - The transaction index within the ledger.
 * @param {number} networkID - The network ID.
 * @returns {string} The CTID.
 * @throws {Error} The ledgerIndex must be a number.
 * @throws {Error} The ledgerIndex must not be greater than 268435455 or less than 0.
 * @throws {Error} The txIndex must be a number.
 * @throws {Error} The txIndex must not be greater than 65535 or less than 0.
 * @throws {Error} The networkID must be a number.
 * @throws {Error} The networkID must not be greater than 65535 or less than 0.
 */
export function encodeCTID(ledgerIndex: number, txIndex: number, networkID: number): string {
  if (typeof ledgerIndex !== "number") {
    throw new Error("ledgerIndex must be a number.");
  }

  if (ledgerIndex > 0xfffffff || ledgerIndex < 0) {
    throw new Error("ledgerIndex must not be greater than 268435455 or less than 0.");
  }

  if (typeof txIndex !== "number") {
    throw new Error("txIndex must be a number.");
  }

  if (txIndex > 0xffff || txIndex < 0) {
    throw new Error("txIndex must not be greater than 65535 or less than 0.");
  }

  if (typeof networkID !== "number") {
    throw new Error("networkID must be a number.");
  }

  if (networkID > 0xffff || networkID < 0) {
    throw new Error("networkID must not be greater than 65535 or less than 0.");
  }

  // eslint-disable-next-line no-bitwise
  return (((BigInt(0xc0000000) + BigInt(ledgerIndex)) << 32n) + (BigInt(txIndex) << 16n) + BigInt(networkID))
    .toString(16)
    .toUpperCase();
}

export interface DecodeCTIDInterface {
  ledgerIndex: number;
  txIndex: number;
  networkID: number;
}

/**
 * @param {string | bigint} ctid - The CTID.
 * @returns {object} The ledgerIndex, txIndex, and networkID.
 * @throws {Error} The CTID must be a hexadecimal string or BigInt.
 * @throws {Error} The CTID must be exactly 16 nibbles and start with a C.
 * @throws {Error} The CTID must not be greater than 0xffffffffffffffff or less than 0.
 */
export function decodeCTID(ctid: string | bigint): DecodeCTIDInterface {
  let ctidValue: bigint;
  if (typeof ctid === "string") {
    if (!CTID_REGEX.test(ctid)) {
      throw new Error("CTID must be exactly 16 nibbles and start with a C");
    }
    // eslint-disable-next-line prefer-template
    ctidValue = BigInt("0x" + ctid);
  } else if (typeof ctid === "bigint") {
    ctidValue = ctid;
  } else {
    throw new Error("CTID must be a hexadecimal string or BigInt");
  }

  // eslint-disable-next-line no-bitwise
  if (ctidValue > 0xffffffffffffffffn || (ctidValue & 0xf000000000000000n) !== 0xc000000000000000n) {
    throw new Error("CTID must be exactly 16 nibbles and start with a C");
  }

  // eslint-disable-next-line no-bitwise
  const ledgerIndex = Number((ctidValue >> 32n) & 0xfffffffn);
  // eslint-disable-next-line no-bitwise
  const txIndex = Number((ctidValue >> 16n) & 0xffffn);
  // eslint-disable-next-line no-bitwise
  const networkID = Number(ctidValue & 0xffffn);

  return {
    ledgerIndex,
    txIndex,
    networkID,
  };
}
