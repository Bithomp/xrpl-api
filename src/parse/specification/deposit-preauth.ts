import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseMemos } from "../ledger/memos";

import { FormattedDepositPreauthSpecification } from "../../types/objects/deposits";

function parseDepositPreauth(tx: any): FormattedDepositPreauthSpecification {
  assert.ok(tx.TransactionType === "DepositPreauth");

  return removeUndefined({
    memos: parseMemos(tx),
    authorize: tx.Authorize,
    unauthorize: tx.Unauthorize,
  });
}

export default parseDepositPreauth;
