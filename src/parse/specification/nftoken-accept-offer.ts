import * as assert from "assert";
import { NFTokenAcceptOffer } from "xrpl";
import { removeUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";
import { FormattedNFTokenAcceptOfferSpecification } from "../../types/nftokens";

function parseNFTokenAcceptOffer(tx: NFTokenAcceptOffer): FormattedNFTokenAcceptOfferSpecification {
  assert.ok(tx.TransactionType === "NFTokenAcceptOffer");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
    source: parseSource(tx),
    nftokenSellOffer: tx.NFTokenSellOffer,
    nftokenBuyOffer: tx.NFTokenBuyOffer,
    nftokenBrokerFee: tx.NFTokenBrokerFee,
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseNFTokenAcceptOffer;
