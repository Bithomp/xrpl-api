import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseSource } from "../ledger/source";
import { parseDestination } from "../ledger/destination";
import parseNFTokenFlags from "../ledger/nftoken-flags";
import { ledgerTimeToUnixTime } from "../../models/ledger";
import { FormattedNFTokenMintSpecification } from "../../types/nftokens";

function parseNFTokenMint(tx: any): FormattedNFTokenMintSpecification {
  assert.ok(tx.TransactionType === "NFTokenMint");

  let expiration: any;
  if (typeof tx.Expiration === "number") {
    expiration = ledgerTimeToUnixTime(tx.Expiration);
  }

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    source: parseSource(tx),
    destination: parseDestination(tx),
    nftokenTaxon: tx.NFTokenTaxon,
    issuer: tx.Issuer,
    transferFee: tx.TransferFee,
    uri: tx.URI,
    flags: parseNFTokenFlags(tx.Flags),
    amount: tx.Amount,
    expiration,
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseNFTokenMint;
