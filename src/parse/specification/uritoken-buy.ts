import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseMemos } from "../ledger/memos";

import { FormattedURITokenBuySpecification } from "../../types/uritokens";

function parseNFTokenBurn(tx: any): FormattedURITokenBuySpecification {
  assert.ok(tx.TransactionType === "URITokenBuy");

  return removeUndefined({
    uritokenID: tx.URITokenID,
    amount: tx.Amount,
    memos: parseMemos(tx),
  });
}

export default parseNFTokenBurn;
