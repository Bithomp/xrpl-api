import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseTxURITokenMintFlags from "../ledger/tx-uritoken-mint-flags";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseSource } from "../ledger/source";
import { parseDestination } from "../ledger/destination";
import { FormattedURITokenMintSpecification } from "../../types/uritokens";

function parseURITokenMint(tx: any, nativeCurrency?: string): FormattedURITokenMintSpecification {
  assert.ok(tx.TransactionType === "URITokenMint");

  return removeUndefined({
    uri: tx.URI,
    flags: parseTxURITokenMintFlags(tx.Flags, { nativeCurrency }),
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

export default parseURITokenMint;
