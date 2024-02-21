import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseMemos } from "../ledger/memos";
import { parseImportBlob } from "../ledger/import";

import { FormattedSourceAddress } from "../../types/account";
import { FormattedImportSpecification } from "../../types/import";

function parseImport(tx: any): FormattedImportSpecification {
  assert.ok(tx.TransactionType === "Import");

  const source: FormattedSourceAddress = {
    address: tx.Account,
    tag: tx.SourceTag,
  };

  return removeUndefined({
    blob: parseImportBlob(tx.Blob),
    source: removeUndefined(source),
    memos: parseMemos(tx),
  });
}

export default parseImport;
