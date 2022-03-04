import parseTransaction from "../v1/ledger/parse/transaction";

export function getAccountTxDetails(transaction: any, includeRawTransaction: boolean): any {
  return getTxDetails(AccountTxToTx(transaction), includeRawTransaction);
}

export function getTxDetails(tx: any, includeRawTransaction: boolean): any {
  return parseTransaction(tx, includeRawTransaction);
}

export function AccountTxToTx(transaction: any): any {
  return Object.assign({}, transaction.tx, { meta: transaction.meta, validated: transaction.validated });
}
