import * as assert from "assert";
import { EscrowCancel } from "xrpl";
import { removeUndefined, emptyObjectToUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseTxGlobalFlags } from "../ledger/tx-global-flags";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";
import { FormattedEscrowCancelSpecification } from "../../types/escrows";

function parseEscrowCancel(tx: EscrowCancel, nativeCurrency?: string): FormattedEscrowCancelSpecification {
  assert.ok(tx.TransactionType === "EscrowCancel");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
    source: parseSource(tx),
    owner: tx.Owner,
    escrowSequence: tx.OfferSequence,
    emittedDetails: parseEmittedDetails(tx),
    flags: emptyObjectToUndefined(parseTxGlobalFlags(tx.Flags as number, { nativeCurrency })),
    memos: parseMemos(tx),
  });
}

export default parseEscrowCancel;
