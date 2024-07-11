import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseURITokenFlags from "../ledger/uritoken-flags";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseAccount } from "../ledger/account";
import { FormattedSourceAddress, FormattedDestinationAddress } from "../../types/account";
import { FormattedURITokenMintSpecification } from "../../types/uritokens";

function parseNFTokenMint(tx: any): FormattedURITokenMintSpecification {
  assert.ok(tx.TransactionType === "URITokenMint");

  const source: FormattedSourceAddress = removeUndefined({
    address: parseAccount(tx.Account),
    tag: tx.SourceTag,
  });

  const destination: FormattedDestinationAddress = removeUndefined({
    address: tx.Destination,
  });

  return removeUndefined({
    uri: tx.URI,
    flags: parseURITokenFlags(tx.Flags),
    digest: tx.Digest,
    amount: tx.Amount,
    source: Object.keys(source).length > 0 ? source : undefined,
    destination: Object.keys(destination).length > 0 ? destination : undefined,
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseNFTokenMint;
