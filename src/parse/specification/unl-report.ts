import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseSource } from "../ledger/source";
import { parseMemos } from "../ledger/memos";
import { FormattedUNLReportSpecification } from "../../types/unl_reports";

function parseUNLReport(tx: any): FormattedUNLReportSpecification {
  assert.ok(tx.TransactionType === "UNLReport");

  const activeValidator = tx.ActiveValidator?.PublicKey;
  const importVLKey = tx.ImportVLKey?.PublicKey;

  return removeUndefined({
    source: parseSource(tx),
    activeValidator,
    importVLKey,
    memos: parseMemos(tx),
  });
}

export default parseUNLReport;
