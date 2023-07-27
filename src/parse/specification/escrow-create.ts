import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseRippledAmount from "../ledger/ripple-amount";
import { parseTimestamp } from "../utils";
import parseMemos from "../ledger/memos";
import { FormattedEscrowCreateSpecification } from "../../v1/common/types/objects/escrows";
import { SourcePaymentAddress, DestinationPaymentAddress } from "../../v1/common/types/objects/account";

function parseEscrowCreation(tx: any): FormattedEscrowCreateSpecification {
  assert.ok(tx.TransactionType === "EscrowCreate");

  const source: SourcePaymentAddress = {
    address: tx.Account,
    tag: tx.SourceTag,
  };

  const destination: DestinationPaymentAddress = {
    address: tx.Destination,
    tag: tx.DestinationTag,
  };

  return removeUndefined({
    source: removeUndefined(source),
    destination: removeUndefined(destination),
    amount: parseRippledAmount(tx.Amount), // Legacy support
    condition: tx.Condition,
    allowCancelAfter: parseTimestamp(tx.CancelAfter),
    allowExecuteAfter: parseTimestamp(tx.FinishAfter),
    memos: parseMemos(tx),
  });
}

export default parseEscrowCreation;
