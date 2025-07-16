import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseSource } from "../ledger/source";
import { parseDestination } from "../ledger/destination";
import { FormattedURITokenCreateSellOfferSpecification } from "../../types/uritokens";

function parseURITokenCreateSellOffer(tx: any): FormattedURITokenCreateSellOfferSpecification {
  assert.ok(tx.TransactionType === "URITokenCreateSellOffer");

  return removeUndefined({
    uritokenID: tx.URITokenID,
    amount: tx.Amount,
    source: parseSource(tx),
    destination: parseDestination(tx),
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseURITokenCreateSellOffer;
