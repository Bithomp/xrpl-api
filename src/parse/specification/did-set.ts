import * as assert from "assert";
import { DIDSet } from "xrpl";
import { removeUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";
import { FormattedDIDSetSpecification } from "../../types/did";

function parseDidSet(tx: DIDSet): FormattedDIDSetSpecification {
  assert.ok(tx.TransactionType === "DIDSet");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
    source: parseSource(tx),
    uri: tx.URI,
    data: tx.Data,
    didDocument: tx.DIDDocument,
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseDidSet;
