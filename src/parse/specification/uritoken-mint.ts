import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseURITokenFlags from "../ledger/uritoken-flags";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseSource } from "../ledger/source";
import { parseDestination } from "../ledger/destination";
import { FormattedURITokenMintSpecification } from "../../types/uritokens";

function parseNFTokenMint(tx: any): FormattedURITokenMintSpecification {
  assert.ok(tx.TransactionType === "URITokenMint");

  return removeUndefined({
    uri: tx.URI,
    flags: parseURITokenFlags(tx.Flags),
    digest: tx.Digest,
    amount: tx.Amount,
    source: parseSource(tx),
    destination: parseDestination(tx),
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseNFTokenMint;
