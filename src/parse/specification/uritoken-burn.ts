import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseMemos } from "../ledger/memos";

import { FormattedURITokenBurnSpecification } from "../../types/objects/uritokens";

function parseNFTokenBurn(tx: any): FormattedURITokenBurnSpecification {
  assert.ok(tx.TransactionType === "URITokenBurn");

  return removeUndefined({
    uritokenID: tx.URITokenID,
    memos: parseMemos(tx),
  });
}

export default parseNFTokenBurn;
