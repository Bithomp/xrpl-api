import * as assert from "assert";
import { EscrowFinish } from "xrpl";
import { removeUndefined, emptyObjectToUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseTxGlobalFlags } from "../ledger/tx-global-flags";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";
import { FormattedEscrowFinishSpecification } from "../../types/escrows";

function parseEscrowFinish(tx: EscrowFinish, nativeCurrency?: string): FormattedEscrowFinishSpecification {
  assert.ok(tx.TransactionType === "EscrowFinish");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
    source: parseSource(tx),
    owner: tx.Owner,
    escrowSequence: tx.OfferSequence,
    condition: tx.Condition,
    fulfillment: tx.Fulfillment,
    emittedDetails: parseEmittedDetails(tx),
    flags: emptyObjectToUndefined(parseTxGlobalFlags(tx.Flags as number, { nativeCurrency })),
    memos: parseMemos(tx),
  });
}

export default parseEscrowFinish;
