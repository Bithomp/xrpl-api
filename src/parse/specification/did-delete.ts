import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseAccount } from "../ledger/account";
import { FormattedSourceAddress } from "../../types/account";
import { FormattedDIDDeleteSpecification } from "../../types/did";

function parseDidDelete(tx: any): FormattedDIDDeleteSpecification {
  assert.ok(tx.TransactionType === "DIDDelete");

  const source: FormattedSourceAddress = removeUndefined({
    address: parseAccount(tx.Account),
    tag: tx.SourceTag,
  });

  return removeUndefined({
    source: Object.keys(source).length > 0 ? source : undefined,
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseDidDelete;
