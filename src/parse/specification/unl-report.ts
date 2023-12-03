import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseMemos from "../ledger/memos";
import { parseAccount } from "../ledger/account";

import { FormattedSourceAddress } from "../../v1/common/types/objects/account";
import { FormattedUNLReportSpecification } from "../../v1/common/types/objects/unl_report";

function parseImport(tx: any): FormattedUNLReportSpecification {
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
    memos: parseMemos(tx),
  });
}

export default parseImport;
