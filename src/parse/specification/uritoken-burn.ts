import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseSource } from "../ledger/source";
import { FormattedURITokenBurnSpecification } from "../../types/uritokens";

function parseURITokenBurn(tx: any): FormattedURITokenBurnSpecification {
  assert.ok(tx.TransactionType === "URITokenBurn");

  return removeUndefined({
    uritokenID: tx.URITokenID,
    source: parseSource(tx),
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseURITokenBurn;
