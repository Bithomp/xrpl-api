import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseEmitDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";

import { FormattedSourceAddress } from "../../types/account";
import { FormattedEscrowFinishSpecification } from "../../types/escrows";

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
    emitDetails: parseEmitDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseEscrowFinish;
