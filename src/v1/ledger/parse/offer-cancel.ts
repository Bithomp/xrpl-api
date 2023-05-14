import * as assert from "assert";
import parseMemos from "./memos";

import { FormattedOfferCancelSpecification } from "../../common/types/objects/offers";

function parseOfferCancel(tx: any): FormattedOfferCancelSpecification {
  assert.ok(tx.TransactionType === "OfferCancel");
  return {
    memos: parseMemos(tx),
    orderSequence: tx.OfferSequence,
  };
}

export default parseOfferCancel;
