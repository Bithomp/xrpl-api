import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseMemos } from "../ledger/memos";
import { FormattedNFTokenCancelOfferSpecification } from "../../types/objects/nftokens";

function parseNFTokenCancelOffer(tx: any): FormattedNFTokenCancelOfferSpecification {
  assert.ok(tx.TransactionType === "NFTokenCancelOffer");

  return removeUndefined({
    nftokenOffers: tx.NFTokenOffers,
    memos: parseMemos(tx),
  });
}

export default parseNFTokenCancelOffer;
