import * as assert from "assert";
import parseRippledAmount from "./ripple-amount";
import { parseTimestamp } from "./utils";
import { removeUndefined } from "../../common";
import parseMemos from "./memos";

import { FormattedEscrowCreateSpecification } from "../../common/types/objects/escrows";

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
