import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseAmount from "../ledger/amount";
import { parseMemos } from "../ledger/memos";

import { FormattedCheckCashSpecification } from "../../types/objects/checks";

function parseCheckCash(tx: any): FormattedCheckCashSpecification {
  assert.ok(tx.TransactionType === "CheckCash");

  return removeUndefined({
    memos: parseMemos(tx),
    checkID: tx.CheckID,
    amount: tx.Amount && parseAmount(tx.Amount),
    deliverMin: tx.DeliverMin && parseAmount(tx.DeliverMin),
  });
}

export default parseCheckCash;
