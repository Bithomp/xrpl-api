import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseMemos from "../ledger/memos";
import { FormattedCheckCancelSpecification } from "../../v1/common/types/objects/checks";
import { SourcePaymentAddress } from "../../v1/common/types/objects/account";

function parseCheckCancel(tx: any): FormattedCheckCancelSpecification {
  assert.ok(tx.TransactionType === "CheckCancel");

  const source: SourcePaymentAddress = {
    address: tx.Account,
    tag: tx.SourceTag,
  };

  return removeUndefined({
    source: removeUndefined(source),
    memos: parseMemos(tx),
    checkID: tx.CheckID,
  });
}

export default parseCheckCancel;
