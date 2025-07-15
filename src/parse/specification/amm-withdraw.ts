import * as assert from "assert";
import { AMMWithdraw } from "xrpl";
import { removeUndefined } from "../../common";
import parseAmount from "../ledger/amount";
import parseAsset from "../ledger/asset";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";
import { FormattedAmmWithdrawSpecification } from "../../types/amm";
import parseAmmWithdrawFlags from "../ledger/amm-withdraw-flags";

function parseAmmDeposit(tx: AMMWithdraw): FormattedAmmWithdrawSpecification {
  assert.ok(tx.TransactionType === "AMMWithdraw");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
    source: parseSource(tx),
    asset: parseAsset(tx.Asset as any),
    asset2: parseAsset(tx.Asset2 as any),
    amount: tx.Amount ? parseAmount(tx.Amount) : undefined,
    amount2: tx.Amount2 ? parseAmount(tx.Amount2) : undefined,
    ePrice: tx.EPrice ? parseAmount(tx.EPrice) : undefined,
    lpTokenIn: tx.LPTokenOut ? parseAmount(tx.LPTokenIn as any) : undefined,
    flags: parseAmmWithdrawFlags(tx.Flags as number),
    memos: parseMemos(tx),
  });
}

export default parseAmmDeposit;
