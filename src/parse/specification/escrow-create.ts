import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseTimestamp } from "../utils";
import { parseMemos } from "../ledger/memos";

import { FormattedSourceAddress, FormattedDestinationAddress } from "../../types/objects/account";
import { FormattedEscrowCreateSpecification } from "../../types/objects/escrows";

function parseEscrowCreation(tx: any): FormattedEscrowCreateSpecification {
  assert.ok(tx.TransactionType === "EscrowCreate");

  const source: FormattedSourceAddress = {
    address: tx.Account,
    tag: tx.SourceTag,
  };

  const destination: FormattedDestinationAddress = {
    address: tx.Destination,
    tag: tx.DestinationTag,
  };

  return removeUndefined({
    amount: tx.Amount,
    source: removeUndefined(source),
    destination: removeUndefined(destination),
    condition: tx.Condition,
    allowCancelAfter: parseTimestamp(tx.CancelAfter),
    allowExecuteAfter: parseTimestamp(tx.FinishAfter),
    memos: parseMemos(tx),
  });
}

export default parseEscrowCreation;
