import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseEmitDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { FormattedNFTokenAcceptOfferSpecification } from "../../types/nftokens";

function parseNFTokenAcceptOffer(tx: any): FormattedNFTokenAcceptOfferSpecification {
  assert.ok(tx.TransactionType === "NFTokenAcceptOffer");

  return removeUndefined({
    nftokenSellOffer: tx.NFTokenSellOffer,
    nftokenBuyOffer: tx.NFTokenBuyOffer,
    nftokenBrokerFee: tx.NFTokenBrokerFee,
    emitDetails: parseEmitDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseNFTokenAcceptOffer;
