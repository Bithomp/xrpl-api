import * as assert from "assert";
import { parseMemos } from "../ledger/memos";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseSource } from "../ledger/source";
import { FormattedOfferCancelSpecification } from "../../types/offers";

function parseOfferCancel(tx: any): FormattedOfferCancelSpecification {
  assert.ok(tx.TransactionType === "OfferCancel");

  return {
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    source: parseSource(tx),
    orderSequence: tx.OfferSequence,
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  };
}

export default parseOfferCancel;
