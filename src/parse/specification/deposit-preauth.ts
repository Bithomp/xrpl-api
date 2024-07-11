import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";

import { FormattedDepositPreauthSpecification } from "../../types/deposits";

function parseDepositPreauth(tx: any): FormattedDepositPreauthSpecification {
  assert.ok(tx.TransactionType === "DepositPreauth");

  return removeUndefined({
    authorize: tx.Authorize,
    unauthorize: tx.Unauthorize,
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseDepositPreauth;
