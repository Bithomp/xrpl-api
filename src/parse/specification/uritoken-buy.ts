import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseSource } from "../ledger/source";
import { FormattedURITokenBuySpecification } from "../../types/uritokens";

function parseURITokenBuy(tx: any): FormattedURITokenBuySpecification {
  assert.ok(tx.TransactionType === "URITokenBuy");

  return removeUndefined({
    uritokenID: tx.URITokenID,
    amount: tx.Amount,
    source: parseSource(tx),
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseURITokenBuy;
