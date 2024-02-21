import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseMemos } from "../ledger/memos";

import { FormattedSourceAddress } from "../../v1/common/types/objects/account";
import { FormattedEscrowCancelSpecification } from "../../v1/common/types/objects/escrows";

function parseEscrowCancel(tx: any): FormattedEscrowCancelSpecification {
  assert.ok(tx.TransactionType === "EscrowCancel");

  const source: FormattedSourceAddress = {
    address: tx.Account,
    tag: tx.SourceTag,
  };

  return removeUndefined({
    source: removeUndefined(source),
    owner: tx.Owner,
    escrowSequence: tx.OfferSequence,
    memos: parseMemos(tx),
  });
}

export default parseEscrowCancel;
