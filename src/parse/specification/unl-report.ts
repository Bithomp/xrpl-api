import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseEmitDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseAccount } from "../ledger/account";

import { FormattedSourceAddress } from "../../types/account";
import { FormattedUNLReportSpecification } from "../../types/unl_reports";

function parseUNLReport(tx: any): FormattedUNLReportSpecification {
  assert.ok(tx.TransactionType === "UNLReport");

  const source: FormattedSourceAddress = {
    address: parseAccount(tx.Account),
  };

  const activeValidator = tx.ActiveValidator?.PublicKey;
  const importVLKey = tx.ImportVLKey?.PublicKey;

  return removeUndefined({
    source: removeUndefined(source),
    activeValidator,
    importVLKey,
    emitDetails: parseEmitDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseUNLReport;
