import * as assert from "assert";
import { EscrowCreate } from "xrpl";
import { removeUndefined } from "../../common";
import { parseTimestamp } from "../utils";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseTxGlobalFlags } from "../ledger/tx-global-flags";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";
import { parseDestination } from "../ledger/destination";
import { FormattedEscrowCreateSpecification } from "../../types/escrows";

function parseEscrowCreation(tx: EscrowCreate, nativeCurrency?: string): FormattedEscrowCreateSpecification {
  assert.ok(tx.TransactionType === "EscrowCreate");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
    source: parseSource(tx),
    destination: parseDestination(tx),
    amount: tx.Amount,
    condition: tx.Condition,
    allowCancelAfter: parseTimestamp(tx.CancelAfter),
    allowExecuteAfter: parseTimestamp(tx.FinishAfter),
    emittedDetails: parseEmittedDetails(tx),
    flags: parseTxGlobalFlags(tx.Flags as number, { nativeCurrency }),
    memos: parseMemos(tx),
  });
}

export default parseEscrowCreation;
