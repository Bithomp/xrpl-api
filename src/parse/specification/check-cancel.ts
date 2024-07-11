import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";

import { FormattedCheckCancelSpecification } from "../../types/checks";

function parseCheckCancel(tx: any): FormattedCheckCancelSpecification {
  assert.ok(tx.TransactionType === "CheckCancel");

  return removeUndefined({
    checkID: tx.CheckID,
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseCheckCancel;
