import * as assert from "assert";
import { removeUndefined } from "../../v1/common";
import parseMemos from "../ledger/memos";

import { FormattedEscrowCancelSpecification } from "../../v1/common/types/objects/escrows";

function parseEscrowCancel(tx: any): FormattedEscrowCancelSpecification {
  assert.ok(tx.TransactionType === "EscrowCancel");

  return removeUndefined({
    memos: parseMemos(tx),
    owner: tx.Owner,
    escrowSequence: tx.OfferSequence,
  });
}

export default parseEscrowCancel;
