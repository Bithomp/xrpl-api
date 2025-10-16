import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseSource } from "../ledger/source";
import { FormattedURITokenCancelSellOfferSpecification } from "../../types/uritokens";

function parseURITokenCancelSellOffer(tx: any): FormattedURITokenCancelSellOfferSpecification {
  assert.ok(tx.TransactionType === "URITokenCancelSellOffer");

  return removeUndefined({
    uritokenID: tx.URITokenID,
    signers: parseSigners(tx),
    source: parseSource(tx),
    signer: parseSignerRegularKey(tx),
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseURITokenCancelSellOffer;
