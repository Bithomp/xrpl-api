import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseAmount from "../ledger/amount";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseSource } from "../ledger/source";
import { FormattedCheckCashSpecification } from "../../types/checks";

function parseCheckCash(tx: any): FormattedCheckCashSpecification {
  assert.ok(tx.TransactionType === "CheckCash");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    source: parseSource(tx),
    checkID: tx.CheckID,
    amount: tx.Amount && parseAmount(tx.Amount),
    deliverMin: tx.DeliverMin && parseAmount(tx.DeliverMin),
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseCheckCash;
