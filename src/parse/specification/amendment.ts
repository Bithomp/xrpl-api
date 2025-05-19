import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseSource } from "../ledger/source";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { FormattedAmendmentSpecification } from "../../types/amendments";

function parseAmendment(tx: any): FormattedAmendmentSpecification {
  assert.ok(tx.TransactionType === "EnableAmendment");

  return removeUndefined({
    source: parseSource(tx),
    amendment: tx.Amendment,
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseAmendment;
