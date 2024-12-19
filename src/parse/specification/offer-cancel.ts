import * as assert from "assert";
import { parseMemos } from "../ledger/memos";
import { FormattedOfferCancelSpecification } from "../../types/offers";
import { FormattedSourceAddress } from "../../types/account";

function parseOfferCancel(tx: any): FormattedOfferCancelSpecification {
  assert.ok(tx.TransactionType === "OfferCancel");

  const source: FormattedSourceAddress = {
    address: tx.Account,
    tag: tx.SourceTag,
  };

  return {
    source: Object.keys(source).length > 0 ? source : undefined,
    orderSequence: tx.OfferSequence,

    memos: parseMemos(tx),
  };
}

export default parseOfferCancel;
