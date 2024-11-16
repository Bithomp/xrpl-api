import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { FormattedNFTokenCancelOfferSpecification } from "../../types/nftokens";
import { FormattedSourceAddress } from "../../types/account";

function parseNFTokenCancelOffer(tx: any): FormattedNFTokenCancelOfferSpecification {
  assert.ok(tx.TransactionType === "NFTokenCancelOffer");

  const source: FormattedSourceAddress = {
    address: tx.Account,
    tag: tx.SourceTag,
  };

  return removeUndefined({
    source: Object.keys(source).length > 0 ? source : undefined,
    nftokenOffers: tx.NFTokenOffers,
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseNFTokenCancelOffer;
