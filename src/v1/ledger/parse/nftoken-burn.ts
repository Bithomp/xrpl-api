import * as assert from "assert";
import parseMemos from "./memos";
import { removeUndefined } from "../../common";

import { FormattedNFTokenBurnSpecification } from "../../common/types/objects/nftokens";

export function parseNFTokenBurn(tx: any): FormattedNFTokenBurnSpecification {
  assert.ok(tx.TransactionType === "NFTokenBurn");

  return removeUndefined({
    account: tx.Account,
    nftokenID: tx.NFTokenID,
    memos: parseMemos(tx),
  });
}

export default parseNFTokenBurn;
