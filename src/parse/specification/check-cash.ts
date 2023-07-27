import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseAmount from "../ledger/amount";
import parseMemos from "../ledger/memos";
import { FormattedCheckCashSpecification } from "../../v1/common/types/objects/checks";
import { SourcePaymentAddress } from "../../v1/common/types/objects/account";

function parseCheckCash(tx: any): FormattedCheckCashSpecification {
  assert.ok(tx.TransactionType === "CheckCash");

  const source: SourcePaymentAddress = {
    address: tx.Account,
    tag: tx.SourceTag,
  };

  return removeUndefined({
    source: removeUndefined(source),
    memos: parseMemos(tx),
    checkID: tx.CheckID,
    amount: tx.Amount && parseAmount(tx.Amount),
    deliverMin: tx.DeliverMin && parseAmount(tx.DeliverMin),
  });
}

export default parseCheckCash;
