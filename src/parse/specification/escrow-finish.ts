import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseMemos from "../ledger/memos";
import { FormattedEscrowFinishSpecification } from "../../v1/common/types/objects/escrows";
import { SourcePaymentAddress } from "../../v1/common/types/objects/account";

function parseEscrowFinish(tx: any): FormattedEscrowFinishSpecification {
  assert.ok(tx.TransactionType === "EscrowFinish");

  const source: SourcePaymentAddress = {
    address: tx.Account,
    tag: tx.SourceTag,
  };

  return removeUndefined({
    source: removeUndefined(source),
    memos: parseMemos(tx),
    owner: tx.Owner,
    escrowSequence: tx.OfferSequence,
    condition: tx.Condition,
    fulfillment: tx.Fulfillment,
  });
}

export default parseEscrowFinish;
