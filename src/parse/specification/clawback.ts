import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseAmount from "../ledger/amount";
import { parseEmitDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseAccount } from "../ledger/account";
import { FormattedSourceAddress } from "../../types/account";
import { FormattedClawbackSpecification } from "../../types/clawback";

function parseClawback(tx: any): FormattedClawbackSpecification {
  assert.ok(tx.TransactionType === "Clawback");

  const source: FormattedSourceAddress = removeUndefined({
    address: parseAccount(tx.Account),
    tag: tx.SourceTag,
  });

  return removeUndefined({
    source: Object.keys(source).length > 0 ? source : undefined,
    amount: tx.Amount ? parseAmount(tx.Amount) : undefined,
    emitDetails: parseEmitDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseClawback;
