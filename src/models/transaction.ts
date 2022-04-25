import * as _ from "lodash";

import { parseTransaction } from "../v1/ledger/parse/transaction";

export { parseNFTokenChanges } from "./transaction/nfoken_changes";
export { parseNFTokenOfferChanges } from "./transaction/nfoken_offer_changes";
export { parseBalanceChanges } from "./transaction/balance_changes";
export { parseChannelChanges } from "./transaction/channel_changes";
export { parseOrderbookChanges } from "./transaction/orderbook_changes";

export function getTxDetails(tx: any, includeRawTransaction: boolean): any {
  return parseTransaction(tx, includeRawTransaction);
}

export function getAccountTxDetails(transaction: any, includeRawTransaction: boolean): any {
  return getTxDetails(AccountTxToTx(transaction), includeRawTransaction);
}

export function getLedgerTxDetails(transaction: any, ledgerIndex: number, includeRawTransaction: boolean): any {
  return getTxDetails(LedgerTxToTx(transaction, ledgerIndex), includeRawTransaction);
}

export function getStreamTxDetails(transaction: any, ledgerIndex: number, includeRawTransaction: boolean): any {
  return getTxDetails(StreamTxToTx(transaction, ledgerIndex), includeRawTransaction);
}

export function AccountTxToTx(transaction: any): any {
  return Object.assign({}, transaction.tx, { meta: transaction.meta, validated: transaction.validated });
}

export function LedgerTxToTx(transaction: any, ledgerIndex: number): any {
  return Object.assign({}, _.omit(transaction, "metaData"), {
    meta: transaction.metaData,
    ledger_index: ledgerIndex,
  });
}

export function StreamTxToTx(transaction: any, ledgerIndex: number): any {
  return Object.assign({}, transaction.transaction, {
    meta: transaction.meta,
    ledger_index: ledgerIndex,
    validated: transaction.validated,
  });
}
