import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseSource } from "../ledger/source";
import { FormattedNFTokenAcceptOfferSpecification } from "../../types/nftokens";

function parseNFTokenAcceptOffer(tx: any): FormattedNFTokenAcceptOfferSpecification {
  assert.ok(tx.TransactionType === "NFTokenAcceptOffer");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    source: parseSource(tx),
    nftokenSellOffer: tx.NFTokenSellOffer,
    nftokenBuyOffer: tx.NFTokenBuyOffer,
    nftokenBrokerFee: tx.NFTokenBrokerFee,
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseNFTokenAcceptOffer;
