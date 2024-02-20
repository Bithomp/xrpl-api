import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseMemos from "../ledger/memos";
import { parseAccount } from "../ledger/account";
import { FormattedSourceAddress, FormattedDestinationAddress } from "../../v1/common/types/objects/account";
import { FormattedURITokenCreateSellOfferSpecification } from "../../v1/common/types/objects/uritokens";

function parseNFTokenBurn(tx: any): FormattedURITokenCreateSellOfferSpecification {
  assert.ok(tx.TransactionType === "URITokenCreateSellOffer");

  const source: FormattedSourceAddress = {
    address: parseAccount(tx.Account),
    tag: tx.SourceTag,
  };

  const destination: FormattedDestinationAddress = {
    address: tx.Destination,
    tag: tx.DestinationTag,
  };

  return removeUndefined({
    uritokenID: tx.URITokenID,
    amount: tx.Amount,
    source: removeUndefined(source),
    destination: removeUndefined(destination),
    memos: parseMemos(tx),
  });
}

export default parseNFTokenBurn;
