import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseMemos from "./memos";

import { FormattedEscrowCancelSpecification } from "../../common/types/objects/escrows";

function parseEscrowCancel(tx: any): FormattedEscrowCancelSpecification {
  assert.ok(tx.TransactionType === "EscrowCancel");

  return removeUndefined({
    memos: parseMemos(tx),
    owner: tx.Owner,
    escrowSequence: tx.OfferSequence,
  });
}

export default parseEscrowCancel;
