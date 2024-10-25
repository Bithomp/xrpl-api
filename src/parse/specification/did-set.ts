import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseAccount } from "../ledger/account";
import { FormattedSourceAddress } from "../../types/account";
import { FormattedDIDSetSpecification } from "../../types/did";

function parseDidSet(tx: any): FormattedDIDSetSpecification {
  assert.ok(tx.TransactionType === "DIDSet");

  const source: FormattedSourceAddress = removeUndefined({
    address: parseAccount(tx.Account),
    tag: tx.SourceTag,
  });

  return removeUndefined({
    source: Object.keys(source).length > 0 ? source : undefined,
    uri: tx.URI,
    data: tx.Data,
    didDocument: tx.DIDDocument,

    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseDidSet;
