import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseMemos from "../ledger/memos";

import { FormattedEscrowCancelSpecification } from "../../v1/common/types/objects/escrows";

function parseEscrowCancel(tx: any): FormattedEscrowCancelSpecification {
  assert.ok(tx.TransactionType === "EscrowCancel");

  return removeUndefined({
    owner: tx.Owner,
    escrowSequence: tx.OfferSequence,
    memos: parseMemos(tx),
  });
}

export default parseEscrowCancel;
