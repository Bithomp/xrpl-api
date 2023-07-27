import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseMemos from "../ledger/memos";
import { FormattedOfferCancelSpecification } from "../../v1/common/types/objects/offers";
import { SourcePaymentAddress } from "../../v1/common/types/objects/account";

function parseOfferCancel(tx: any): FormattedOfferCancelSpecification {
  assert.ok(tx.TransactionType === "OfferCancel");

  const source: SourcePaymentAddress = {
    address: tx.Account,
    tag: tx.SourceTag,
  };

  return removeUndefined({
    source: removeUndefined(source),
    memos: parseMemos(tx),
    orderSequence: tx.OfferSequence,
  });
}

export default parseOfferCancel;
