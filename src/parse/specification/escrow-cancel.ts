import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseMemos from "../ledger/memos";
import { FormattedEscrowCancelSpecification } from "../../v1/common/types/objects/escrows";
import { SourcePaymentAddress } from "../../v1/common/types/objects/account";

function parseEscrowCancel(tx: any): FormattedEscrowCancelSpecification {
  assert.ok(tx.TransactionType === "EscrowCancel");

  const source: SourcePaymentAddress = {
    address: tx.Account,
    tag: tx.SourceTag,
  };

  return removeUndefined({
    source: removeUndefined(source),
    memos: parseMemos(tx),
    owner: tx.Owner,
    escrowSequence: tx.OfferSequence,
  });
}

export default parseEscrowCancel;
