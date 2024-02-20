import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseMemos from "../ledger/memos";
import parseURITokenFlags from "../ledger/uritoken-flags";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseAccount } from "../ledger/account";
import { FormattedSourceAddress, FormattedDestinationAddress } from "../../v1/common/types/objects/account";
import { FormattedURITokenMintSpecification } from "../../v1/common/types/objects/uritokens";

function parseNFTokenMint(tx: any): FormattedURITokenMintSpecification {
  assert.ok(tx.TransactionType === "URITokenMint");

  const emittedDetails = parseEmittedDetails(tx);

  const source: FormattedSourceAddress = {
    address: parseAccount(tx.Account),
    tag: tx.SourceTag,
  };

  const destination: FormattedDestinationAddress = {
    address: tx.Destination,
    tag: tx.DestinationTag,
  };

  return removeUndefined({
    uri: tx.URI,
    flags: parseURITokenFlags(tx.Flags),
    digest: tx.Digest,
    amount: tx.Amount,
    source: removeUndefined(source),
    destination: removeUndefined(destination),
    emittedDetails,
    memos: parseMemos(tx),
  });
}

export default parseNFTokenMint;
