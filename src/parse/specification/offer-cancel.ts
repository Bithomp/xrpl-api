import * as assert from "assert";
import { parseEmitDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { FormattedOfferCancelSpecification } from "../../types/offers";

function parseOfferCancel(tx: any): FormattedOfferCancelSpecification {
  assert.ok(tx.TransactionType === "OfferCancel");

  return {
    orderSequence: tx.OfferSequence,
    emitDetails: parseEmitDetails(tx),
    memos: parseMemos(tx),
  };
}

export default parseOfferCancel;
