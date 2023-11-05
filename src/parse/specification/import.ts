import * as assert from "assert";
import parseMemos from "../ledger/memos";
import { parseImportBlob } from "../ledger/import";

import { FormattedImportSpecification } from "../../v1/common/types/objects/import";

function parseImport(tx: any): FormattedImportSpecification {
  assert.ok(tx.TransactionType === "Import");

  return {
    blob: parseImportBlob(tx.Blob),
    memos: parseMemos(tx),
  };
}

export default parseImport;
