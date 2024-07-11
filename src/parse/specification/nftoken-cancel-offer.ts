import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { FormattedNFTokenCancelOfferSpecification } from "../../types/nftokens";

function parseNFTokenCancelOffer(tx: any): FormattedNFTokenCancelOfferSpecification {
  assert.ok(tx.TransactionType === "NFTokenCancelOffer");

  return removeUndefined({
    nftokenOffers: tx.NFTokenOffers,
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseNFTokenCancelOffer;
