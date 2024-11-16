import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import parseNFTokenFlags from "../ledger/nftoken-flags";
import { ledgerTimeToUnixTime } from "../../models/ledger";
import { parseAccount } from "../ledger/account";
import { FormattedSourceAddress, FormattedDestinationAddress } from "../../types/account";
import { FormattedNFTokenMintSpecification } from "../../types/nftokens";

function parseNFTokenMint(tx: any): FormattedNFTokenMintSpecification {
  assert.ok(tx.TransactionType === "NFTokenMint");

  const source: FormattedSourceAddress = removeUndefined({
    address: parseAccount(tx.Account),
    tag: tx.SourceTag,
  });

  const destination: FormattedDestinationAddress = removeUndefined({
    address: tx.Destination,
  });

  let expiration: any;
  if (typeof tx.Expiration === "number") {
    expiration = ledgerTimeToUnixTime(tx.Expiration);
  }

  return removeUndefined({
    source: Object.keys(source).length > 0 ? source : undefined,
    nftokenTaxon: tx.NFTokenTaxon,
    issuer: tx.Issuer,
    transferFee: tx.TransferFee,
    uri: tx.URI,
    flags: parseNFTokenFlags(tx.Flags),
    amount: tx.Amount,
    destination: Object.keys(destination).length > 0 ? destination : undefined,
    expiration,
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseNFTokenMint;
