import { removeUndefined } from "../../common";
import parseAmount from "./amount";
import { removeGenericCounterparty } from "../utils";
import { FormattedSourceAddress } from "../../types/account";

// {
//   "Account": "rEXmdJZRfjXN3XGVdz99dGSZpQyJqUeirE",
//   "SourceTag": 999,
// }
export function parseSourceWithAmount(tx: any): FormattedSourceAddress | undefined {
  if (tx && tx.Account) {
    return removeUndefined({
      address: tx.Account,
      // Note: DeliverMax is only present in rippled 2.0.0+
      maxAmount: removeGenericCounterparty(parseAmount(tx.SendMax || tx.DeliverMax || tx.Amount), tx.Account),
      tag: tx.SourceTag,
    });
  }
}

export function parseSource(tx: any): FormattedSourceAddress | undefined {
  if (tx && tx.Account) {
    return removeUndefined({
      address: tx.Account,
      tag: tx.SourceTag,
    });
  }
}
