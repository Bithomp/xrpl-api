import * as assert from "assert";
import { NFTokenCreateOffer } from "xrpl";
import { removeUndefined } from "../../common";
import { parseMemos } from "../ledger/memos";
import parseTxNFTOfferCreateFlags from "../ledger/tx-nftoken-offer-create-flags";
import { ledgerTimeToUnixTime } from "../../models/ledger";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";
import { parseDestination } from "../ledger/destination";
import { FormattedNFTokenCreateOfferSpecification } from "../../types/nftokens";

function parseNFTokenCreateOffer(
  tx: NFTokenCreateOffer,
  nativeCurrency?: string
): FormattedNFTokenCreateOfferSpecification {
  assert.ok(tx.TransactionType === "NFTokenCreateOffer");

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
    nftokenID: tx.NFTokenID,
    amount: tx.Amount,
    owner: tx.Owner,
    expiration,
    flags: parseTxNFTOfferCreateFlags(tx.Flags as number, { nativeCurrency }),
    memos: parseMemos(tx),
  });
}

export default parseNFTokenCreateOffer;
