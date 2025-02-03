import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseAmount from "../ledger/amount";
import parseAsset from "../ledger/asset";
import { parseMemos } from "../ledger/memos";
import { parseAccount } from "../ledger/account";
import { FormattedSourceAddress } from "../../types/account";
import { FormattedAmmWithdrawSpecification } from "../../types/amm";
import parseAmmWithdrawFlags from "../ledger/amm-withdraw-flags";

function parseAmmDeposit(tx: any): FormattedAmmWithdrawSpecification {
  assert.ok(tx.TransactionType === "AMMWithdraw");

  const source: FormattedSourceAddress = removeUndefined({
    address: parseAccount(tx.Account),
    tag: tx.SourceTag,
  });

  return removeUndefined({
    source: Object.keys(source).length > 0 ? source : undefined,
    asset: parseAsset(tx.Asset),
    asset2: parseAsset(tx.Asset2),
    amount: tx.Amount ? parseAmount(tx.Amount) : undefined,
    amount2: tx.Amount2 ? parseAmount(tx.Amount2) : undefined,
    ePrice: tx.EPrice ? parseAmount(tx.EPrice) : undefined,
    lpTokenIn: tx.LPTokenOut ? parseAmount(tx.LPTokenIn) : undefined,
    flags: parseAmmWithdrawFlags(tx.Flags),
    memos: parseMemos(tx),
  });
}

export default parseAmmDeposit;
