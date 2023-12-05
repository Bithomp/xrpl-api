import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseMemos from "../ledger/memos";

import { FormattedAccountDeleteSpecification } from "../../v1/common/types/objects/account";

function parseAccountDelete(tx: any): FormattedAccountDeleteSpecification {
  assert.ok(tx.TransactionType === "AccountDelete");

  return removeUndefined({
    memos: parseMemos(tx),
    destination: tx.Destination,
    destinationTag: tx.DestinationTag,
  });
}

export default parseAccountDelete;
