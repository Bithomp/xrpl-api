import * as assert from "assert";
import { removeUndefined } from "../../v1/common";
import parseMemos from "../ledger/memos";

import { FormattedNFTokenCancelOfferSpecification } from "../../v1/common/types/objects/nftokens";

export function parseNFTokenCancelOffer(tx: any): FormattedNFTokenCancelOfferSpecification {
  assert.ok(tx.TransactionType === "NFTokenCancelOffer");

  return removeUndefined({
    nftokenOffers: tx.NFTokenOffers,
    memos: parseMemos(tx),
  });
}

export default parseNFTokenCancelOffer;
