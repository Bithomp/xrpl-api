import parseTransaction from "../v1/ledger/parse/transaction";

export function getAccountTxDetails(transaction: any): any {
  return getTxDetails(AccountTxToTx(transaction));
}

export function getTxDetails(tx: any): any {
  const specification = parseTransaction(tx, true);

  return specification;
}

export function AccountTxToTx(transaction: any): any {
  return Object.assign({}, transaction.tx, { meta: transaction.meta, validated: transaction.validated });
}
