import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseMemos from "../ledger/memos";

import { FormattedSourceAddress } from "../../v1/common/types/objects/account";
import { FormattedEscrowFinishSpecification } from "../../v1/common/types/objects/escrows";

function parseEscrowFinish(tx: any): FormattedEscrowFinishSpecification {
  assert.ok(tx.TransactionType === "EscrowFinish");

  const source: FormattedSourceAddress = {
    address: tx.Account,
    tag: tx.SourceTag,
  };

  return removeUndefined({
    source: removeUndefined(source),
    owner: tx.Owner,
    escrowSequence: tx.OfferSequence,
    condition: tx.Condition,
    fulfillment: tx.Fulfillment,
    memos: parseMemos(tx),
  });
}

export default parseEscrowFinish;
