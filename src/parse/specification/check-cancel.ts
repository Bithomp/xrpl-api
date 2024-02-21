import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseMemos } from "../ledger/memos";

import { FormattedCheckCancelSpecification } from "../../types/checks";

function parseCheckCancel(tx: any): FormattedCheckCancelSpecification {
  assert.ok(tx.TransactionType === "CheckCancel");

  return removeUndefined({
    memos: parseMemos(tx),
    checkID: tx.CheckID,
  });
}

export default parseCheckCancel;
