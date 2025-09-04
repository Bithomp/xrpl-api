import * as assert from "assert";
import { NFTokenMint } from "xrpl";
import { removeUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";
import { parseDestination } from "../ledger/destination";
import parseTxNFTokenMintFlags from "../ledger/tx-nftoken-mint-flags";
import { ledgerTimeToUnixTime } from "../../models/ledger";
import { FormattedNFTokenMintSpecification } from "../../types/nftokens";

function parseNFTokenMint(tx: NFTokenMint, nativeCurrency?: string): FormattedNFTokenMintSpecification {
  assert.ok(tx.TransactionType === "NFTokenMint");

  let expiration: any;
  if (typeof tx.Expiration === "number") {
    expiration = ledgerTimeToUnixTime(tx.Expiration);
  }

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
    source: parseSource(tx),
    destination: parseDestination(tx),
    nftokenTaxon: tx.NFTokenTaxon,
    issuer: tx.Issuer,
    transferFee: tx.TransferFee,
    uri: tx.URI,
    flags: parseTxNFTokenMintFlags(tx.Flags as number, { nativeCurrency }),
    amount: tx.Amount,
    expiration,
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseNFTokenMint;
