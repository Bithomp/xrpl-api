import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseSource } from "../ledger/source";
import { parseRemarks } from "../ledger/remarks";
import { FormattedSetRemarksSpecification } from "../../types/remarks";

function parseSetRemarks(tx: any): FormattedSetRemarksSpecification {
  assert.ok(tx.TransactionType === "SetRemarks");

  return removeUndefined({
    objectID: tx.ObjectID,
    remarks: parseRemarks(tx.Remarks),
    source: parseSource(tx),
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseSetRemarks;
