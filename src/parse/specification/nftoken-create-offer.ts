import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseMemos from "../ledger/memos";
import parseNFTOfferFlags from "../ledger/nftoken-offer-flags";
import { ledgerTimeToUnixTime } from "../../models/ledger";
import { FormattedNFTokenCreateOfferSpecification } from "../../v1/common/types/objects/nftokens";

function parseNFTokenCreateOffer(tx: any): FormattedNFTokenCreateOfferSpecification {
  assert.ok(tx.TransactionType === "NFTokenCreateOffer");

  let expiration: any;
  if (typeof tx.Expiration === "number") {
    expiration = ledgerTimeToUnixTime(tx.Expiration);
  }

  return removeUndefined({
    nftokenID: tx.NFTokenID,
    amount: tx.Amount,
    owner: tx.Owner,
    destination: tx.Destination,
    expiration,
    flags: parseNFTOfferFlags(tx.Flags),
    memos: parseMemos(tx),
  });
}

export default parseNFTokenCreateOffer;
