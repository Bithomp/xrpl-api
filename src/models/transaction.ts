import * as _ from "lodash";

import { parseTransaction } from "../v1/ledger/parse/transaction";

export { parseNFTokenChanges } from "./transaction/nftoken_changes";
export { parseNFTokenOfferChanges } from "./transaction/nftoken_offer_changes";
export { parseBalanceChanges } from "./transaction/balance_changes";
export { parseLockedBalanceChanges } from "./transaction/locked_balance_changes";
export { parseChannelChanges } from "./transaction/channel_changes";
export { parseOrderbookChanges } from "./transaction/orderbook_changes";

export function getTxDetails(tx: any, includeRawTransaction: boolean): any {
  return parseTransaction(tx, includeRawTransaction);
}

export function getAccountTxDetails(transaction: any, includeRawTransaction: boolean): any {
  return getTxDetails(AccountTxToTx(transaction), includeRawTransaction);
}

export function getLedgerTxDetails(
  transaction: any,
  ledgerIndex: number,
  closeTime: number,
  includeRawTransaction: boolean
): any {
  return getTxDetails(LedgerTxToTx(transaction, ledgerIndex, closeTime), includeRawTransaction);
}

export function getStreamTxDetails(transaction: any, includeRawTransaction: boolean): any {
  return getTxDetails(StreamTxToTx(transaction), includeRawTransaction);
}

export function AccountTxToTx(transaction: any): any {
  return Object.assign({}, transaction.tx, { meta: transaction.meta, validated: transaction.validated });
}

export function LedgerTxToTx(transaction: any, ledgerIndex: number, closeTime: number): any {
  const tx = Object.assign({}, _.omit(transaction, "metaData"), {
    date: closeTime,
  });

  return Object.assign({}, tx, {
    meta: transaction.metaData,
    ledger_index: ledgerIndex,
  });
}

export function StreamTxToTx(transaction: any): any {
  return Object.assign({}, transaction.transaction, {
    meta: transaction.meta,
    ledger_index: transaction.ledger_index,
    validated: transaction.validated,
  });
}
