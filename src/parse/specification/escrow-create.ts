import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseTimestamp } from "../utils";
import { parseEmitDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";

import { FormattedSourceAddress, FormattedDestinationAddress } from "../../types/account";
import { FormattedEscrowCreateSpecification } from "../../types/escrows";

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
    emitDetails: parseEmitDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseEscrowCreation;
