import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseEmitDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import parseNFTOfferFlags from "../ledger/nftoken-offer-flags";
import { ledgerTimeToUnixTime } from "../../models/ledger";
import { parseAccount } from "../ledger/account";
import { FormattedSourceAddress, FormattedDestinationAddress } from "../../types/account";

import { FormattedNFTokenCreateOfferSpecification } from "../../types/nftokens";

function parseNFTokenCreateOffer(tx: any): FormattedNFTokenCreateOfferSpecification {
  assert.ok(tx.TransactionType === "NFTokenCreateOffer");

  let expiration: any;
  if (typeof tx.Expiration === "number") {
    expiration = ledgerTimeToUnixTime(tx.Expiration);
  }

  const source: FormattedSourceAddress = removeUndefined({
    address: parseAccount(tx.Account),
    tag: tx.SourceTag,
  });

  const destination: FormattedDestinationAddress = removeUndefined({
    address: tx.Destination,
  });

  return removeUndefined({
    nftokenID: tx.NFTokenID,
    amount: tx.Amount,
    owner: tx.Owner,
    source: Object.keys(source).length > 0 ? source : undefined,
    destination: Object.keys(destination).length > 0 ? destination : undefined,
    expiration,
    flags: parseNFTOfferFlags(tx.Flags),
    emitDetails: parseEmitDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseNFTokenCreateOffer;
