import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseMemos from "../ledger/memos";
import parseNFTOfferFlags from "../ledger/nftoken-offer-flags";
import { ledgerTimeToUnixTime } from "../../models/ledger";
import { FormattedNFTokenCreateOfferSpecification } from "../../v1/common/types/objects/nftokens";
import { SourcePaymentAddress, DestinationPaymentAddress } from "../../v1/common/types/objects/account";

function parseNFTokenCreateOffer(tx: any): FormattedNFTokenCreateOfferSpecification {
  assert.ok(tx.TransactionType === "NFTokenCreateOffer");

  const source: SourcePaymentAddress = {
    address: tx.Account,
    tag: tx.SourceTag,
  };

  let destination: DestinationPaymentAddress | undefined = undefined;
  if (tx.Destination) {
    destination = removeUndefined({
      address: tx.Destination,
    });
  }

  let expiration: number | undefined = undefined;
  if (typeof tx.Expiration === "number") {
    expiration = ledgerTimeToUnixTime(tx.Expiration);
  }

  return removeUndefined({
    source: removeUndefined(source),
    nftokenID: tx.NFTokenID,
    amount: tx.Amount,
    owner: tx.Owner,
    destination,
    expiration,
    flags: parseNFTOfferFlags(tx.Flags),
    memos: parseMemos(tx),
  });
}

export default parseNFTokenCreateOffer;
