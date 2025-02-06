import * as assert from "assert";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseSource } from "../ledger/source";
import { parseDestination } from "../ledger/destination";
import { FormattedInvokeSpecification } from "../../types/invoke";

function parseInvoke(tx: any): FormattedInvokeSpecification {
  assert.ok(tx.TransactionType === "Invoke");

  return {
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    source: parseSource(tx),
    destination: parseDestination(tx),
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  };
}

export default parseInvoke;
