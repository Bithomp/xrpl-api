import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseMemos from "../ledger/memos";
import { FormattedNFTokenAcceptOfferSpecification } from "../../v1/common/types/objects/nftokens";
import { SourcePaymentAddress } from "../../v1/common/types/objects/account";

function parseNFTokenAcceptOffer(tx: any): FormattedNFTokenAcceptOfferSpecification {
  assert.ok(tx.TransactionType === "NFTokenAcceptOffer");

  const source: SourcePaymentAddress = {
    address: tx.Account,
    tag: tx.SourceTag,
  };

  return removeUndefined({
    source: removeUndefined(source),
    nftokenSellOffer: tx.NFTokenSellOffer,
    nftokenBuyOffer: tx.NFTokenBuyOffer,
    nftokenBrokerFee: tx.NFTokenBrokerFee,
    memos: parseMemos(tx),
  });
}

export default parseNFTokenAcceptOffer;
