import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseMemos from "../ledger/memos";
import { FormattedNFTokenCancelOfferSpecification } from "../../v1/common/types/objects/nftokens";
import { SourcePaymentAddress } from "../../v1/common/types/objects/account";

function parseNFTokenCancelOffer(tx: any): FormattedNFTokenCancelOfferSpecification {
  assert.ok(tx.TransactionType === "NFTokenCancelOffer");

  const source: SourcePaymentAddress = {
    address: tx.Account,
    tag: tx.SourceTag,
  };

  return removeUndefined({
    source: removeUndefined(source),
    nftokenOffers: tx.NFTokenOffers,
    memos: parseMemos(tx),
  });
}

export default parseNFTokenCancelOffer;
