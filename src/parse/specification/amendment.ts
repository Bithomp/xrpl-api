import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseEmitDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { FormattedAmendmentSpecification } from "../../types/amendments";

function parseAmendment(tx: any): FormattedAmendmentSpecification {
  assert.ok(tx.TransactionType === "EnableAmendment");

  return removeUndefined({
    amendment: tx.Amendment,
    emitDetails: parseEmitDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseAmendment;
