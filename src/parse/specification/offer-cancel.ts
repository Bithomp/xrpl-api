import * as assert from "assert";
import { OfferCancel } from "xrpl";
import { removeUndefined, emptyObjectToUndefined } from "../../common";
import { parseTxGlobalFlags } from "../ledger/tx-global-flags";
import { parseMemos } from "../ledger/memos";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";
import { FormattedOfferCancelSpecification } from "../../types/offers";

function parseOfferCancel(tx: OfferCancel, nativeCurrency?: string): FormattedOfferCancelSpecification {
  assert.ok(tx.TransactionType === "OfferCancel");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
    source: parseSource(tx),
    orderSequence: tx.OfferSequence,
    emittedDetails: parseEmittedDetails(tx),
    flags: emptyObjectToUndefined(parseTxGlobalFlags(tx.Flags as number, { nativeCurrency })),
    memos: parseMemos(tx),
  });
}

export default parseOfferCancel;
