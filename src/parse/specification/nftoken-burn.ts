import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";

import { FormattedNFTokenBurnSpecification } from "../../types/nftokens";

function parseNFTokenBurn(tx: any): FormattedNFTokenBurnSpecification {
  assert.ok(tx.TransactionType === "NFTokenBurn");

  return removeUndefined({
    account: tx.Account,
    nftokenID: tx.NFTokenID,
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseNFTokenBurn;
