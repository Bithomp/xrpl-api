import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseMemos from "../ledger/memos";
import { FormattedDepositPreauthSpecification } from "../../v1/common/types/objects/deposits";
import { SourcePaymentAddress } from "../../v1/common/types/objects/account";

function parseDepositPreauth(tx: any): FormattedDepositPreauthSpecification {
  assert.ok(tx.TransactionType === "DepositPreauth");

  const source: SourcePaymentAddress = {
    address: tx.Account,
    tag: tx.SourceTag,
  };

  return removeUndefined({
    source: removeUndefined(source),
    memos: parseMemos(tx),
    authorize: tx.Authorize,
    unauthorize: tx.Unauthorize,
  });
}

export default parseDepositPreauth;
