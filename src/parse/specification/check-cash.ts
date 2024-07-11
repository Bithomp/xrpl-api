import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseAmount from "../ledger/amount";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";

import { FormattedCheckCashSpecification } from "../../types/checks";

function parseCheckCash(tx: any): FormattedCheckCashSpecification {
  assert.ok(tx.TransactionType === "CheckCash");

  return removeUndefined({
    checkID: tx.CheckID,
    amount: tx.Amount && parseAmount(tx.Amount),
    deliverMin: tx.DeliverMin && parseAmount(tx.DeliverMin),
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseCheckCash;
