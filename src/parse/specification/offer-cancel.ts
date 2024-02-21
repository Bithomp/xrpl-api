import * as assert from "assert";
import { parseMemos } from "../ledger/memos";

import { FormattedOfferCancelSpecification } from "../../v1/common/types/objects/offers";

function parseOfferCancel(tx: any): FormattedOfferCancelSpecification {
  assert.ok(tx.TransactionType === "OfferCancel");

  return {
    memos: parseMemos(tx),
    orderSequence: tx.OfferSequence,
  };
}

export default parseOfferCancel;
