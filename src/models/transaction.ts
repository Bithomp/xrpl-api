import _ from "lodash";
import { Transaction, TransactionMetadata } from "xrpl";

import { parseTransaction, FormattedSpecification, TransactionDetailsInterface } from "../v1/ledger/parse/transaction";
export { TransactionDetailsInterface } from "../v1/ledger/parse/transaction";
import { Outcome } from "../v1/transaction/types";

export { parseAffectedObjects } from "./transaction/affected_objects";
export { parseNFTokenChanges } from "./transaction/nftoken_changes";
export { parseNFTokenOfferChanges } from "./transaction/nftoken_offer_changes";
export { parseBalanceChanges } from "./transaction/balance_changes";
export { parseLockedBalanceChanges } from "./transaction/locked_balance_changes";
export { parseChannelChanges } from "./transaction/channel_changes";
export { parseOrderbookChanges } from "./transaction/orderbook_changes";

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
}

export function getTxDetails(tx: TransactionResponse, includeRawTransaction: boolean): TransactionDetailsInterface {
  return parseTransaction(tx, includeRawTransaction);
}

export function getAccountTxDetails(
  tx: AccountTransaction,
  includeRawTransaction: boolean
): TransactionDetailsInterface {
  return getTxDetails(AccountTxToTx(tx), includeRawTransaction);
}

export function getLedgerTxDetails(
  tx: LedgerTransaction,
  ledgerIndex: number,
  closeTime: number,
  includeRawTransaction: boolean
): TransactionDetailsInterface {
  return getTxDetails(LedgerTxToTx(tx, ledgerIndex, closeTime), includeRawTransaction);
}

export function getStreamTxDetails(tx: StreamTransaction, includeRawTransaction: boolean): TransactionDetailsInterface {
  return getTxDetails(StreamTxToTx(tx), includeRawTransaction);
}

export function AccountTxToTx(accountTx: AccountTransaction): TransactionResponse {
  return Object.assign({}, accountTx.tx, { meta: accountTx.meta, validated: accountTx.validated });
}

export function LedgerTxToTx(ledgerTx: LedgerTransaction, ledgerIndex: number, closeTime: number): TransactionResponse {
  const tx = _.omit(ledgerTx, "metaData") as TransactionResponse;

  return Object.assign({}, tx, {
    meta: ledgerTx.metaData,
    date: closeTime,
    ledger_index: ledgerIndex,
  });
}

export function StreamTxToTx(streamTx: StreamTransaction): TransactionResponse {
  return Object.assign({}, streamTx.transaction, {
    meta: streamTx.meta,
    ledger_index: streamTx.ledger_index,
    validated: streamTx.validated,
  });
}
