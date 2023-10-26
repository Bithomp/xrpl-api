import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseMemos from "../ledger/memos";

import { FormattedURITokenCancelSellOfferSpecification } from "../../v1/common/types/objects/uritokens";

function parseNFTokenBurn(tx: any): FormattedURITokenCancelSellOfferSpecification {
  assert.ok(tx.TransactionType === "URITokenCreateSellOffer");

  return removeUndefined({
    uritokenID: tx.URITokenID,
    amount: tx.Amount,
    destination: tx.Destination,
    memos: parseMemos(tx),
  });
}

export default parseNFTokenBurn;
