import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseImportBlob } from "../ledger/import";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseSource } from "../ledger/source";
import { FormattedImportSpecification } from "../../types/import";

function parseImport(tx: any): FormattedImportSpecification {
  assert.ok(tx.TransactionType === "Import");

  return removeUndefined({
    blob: parseImportBlob(tx.Blob),
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    source: parseSource(tx),
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseImport;
