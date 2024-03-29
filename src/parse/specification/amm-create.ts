import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseAmount from "../ledger/amount";
import { parseMemos } from "../ledger/memos";
import { parseAccount } from "../ledger/account";
import { FormattedSourceAddress } from "../../types/account";
import { FormattedAmmCreateSpecification } from "../../types/amm";

function parseAmmCreate(tx: any): FormattedAmmCreateSpecification {
  assert.ok(tx.TransactionType === "AMMCreate");

  const source: FormattedSourceAddress = removeUndefined({
    address: parseAccount(tx.Account),
    tag: tx.SourceTag,
  });

  return removeUndefined({
    source: Object.keys(source).length > 0 ? source : undefined,
    memos: parseMemos(tx),
    amount: parseAmount(tx.Amount),
    amount2: parseAmount(tx.Amount2),
    tradingFee: tx.TradingFee,
  });
}

export default parseAmmCreate;
