import { parseTransaction } from "../v1/ledger/parse/transaction";

export { parseNonFungibleTokenChanges } from "./transaction/nfoken_changes";
export { parseNonFungibleTokenOfferChanges } from "./transaction/nfoken_offer_changes";
export { parseBalanceChanges } from "./transaction/balance_changes";
export { parseChannelChanges } from "./transaction/channel_changes";
export { parseOrderbookChanges } from "./transaction/orderbook_changes";

export function getAccountTxDetails(transaction: any, includeRawTransaction: boolean): any {
  return getTxDetails(AccountTxToTx(transaction), includeRawTransaction);
}

export function getTxDetails(tx: any, includeRawTransaction: boolean): any {
  return parseTransaction(tx, includeRawTransaction);
}

export function AccountTxToTx(transaction: any): any {
  return Object.assign({}, transaction.tx, { meta: transaction.meta, validated: transaction.validated });
}
