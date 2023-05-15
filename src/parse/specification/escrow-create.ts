import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseRippledAmount from "../ledger/ripple-amount";
import { parseTimestamp } from "../utils";
import parseMemos from "../ledger/memos";

import { FormattedEscrowCreateSpecification } from "../../v1/common/types/objects/escrows";

function parseEscrowCreation(tx: any): FormattedEscrowCreateSpecification {
  assert.ok(tx.TransactionType === "EscrowCreate");

  return removeUndefined({
    amount: parseRippledAmount(tx.Amount), // Legacy support
    destination: tx.Destination,
    memos: parseMemos(tx),
    condition: tx.Condition,
    allowCancelAfter: parseTimestamp(tx.CancelAfter),
    allowExecuteAfter: parseTimestamp(tx.FinishAfter),
    sourceTag: tx.SourceTag,
    destinationTag: tx.DestinationTag,
  });
}

export default parseEscrowCreation;
