import parseTransaction from "../v1/ledger/parse/transaction";

export function getSpecification(transactions: any): any {
  const specification = parseTransaction(transactions, true);

  return specification;
}
