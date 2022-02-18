import parseTransaction from "../v1/ledger/parse/transaction";

export function getAccountTxDetails(transactions: any): any {
  return getTxDetails(
    Object.assign({}, transactions.tx, { meta: transactions.meta, validated: transactions.validated })
  );
}

export function getTxDetails(tx: any): any {
  const specification = parseTransaction(tx, true);

  return specification;
}
