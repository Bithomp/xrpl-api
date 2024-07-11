import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseEmitDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";

import { FormattedURITokenCancelSellOfferSpecification } from "../../types/uritokens";

function parseNFTokenBurn(tx: any): FormattedURITokenCancelSellOfferSpecification {
  assert.ok(tx.TransactionType === "URITokenCancelSellOffer");

  return removeUndefined({
    uritokenID: tx.URITokenID,
    emitDetails: parseEmitDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseNFTokenBurn;
