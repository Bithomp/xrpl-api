import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseMemos from "../ledger/memos";
import { parseAccount } from "../ledger/account";
import { FormattedSourceAddress, FormattedDestinationAddress } from "../../v1/common/types/objects/account";
import { FormattedURITokenCreateSellOfferSpecification } from "../../v1/common/types/objects/uritokens";

function parseNFTokenBurn(tx: any): FormattedURITokenCreateSellOfferSpecification {
  assert.ok(tx.TransactionType === "URITokenCreateSellOffer");

  const source: FormattedSourceAddress = removeUndefined({
    address: parseAccount(tx.Account),
    tag: tx.SourceTag,
  });

  const destination: FormattedDestinationAddress = removeUndefined({
    address: tx.Destination,
  });

  return removeUndefined({
    uritokenID: tx.URITokenID,
    amount: tx.Amount,
    source: Object.keys(source).length > 0 ? source : undefined,
    destination: Object.keys(destination).length > 0 ? destination : undefined,
    memos: parseMemos(tx),
  });
}

export default parseNFTokenBurn;
