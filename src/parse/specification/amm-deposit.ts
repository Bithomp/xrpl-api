import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseAmount from "../ledger/amount";
import parseAsset from "../ledger/asset";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseSource } from "../ledger/source";
import { FormattedAmmDepositSpecification } from "../../types/amm";
import parseAmmDepositFlags from "../ledger/amm-deposit-flags";

function parseAmmDeposit(tx: any): FormattedAmmDepositSpecification {
  assert.ok(tx.TransactionType === "AMMDeposit");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    source: parseSource(tx),
    asset: parseAsset(tx.Asset),
    asset2: parseAsset(tx.Asset2),
    amount: tx.Amount ? parseAmount(tx.Amount) : undefined,
    amount2: tx.Amount2 ? parseAmount(tx.Amount2) : undefined,
    ePrice: tx.EPrice ? parseAmount(tx.EPrice) : undefined,
    lpTokenOut: tx.LPTokenOut ? parseAmount(tx.LPTokenOut) : undefined,
    flags: parseAmmDepositFlags(tx.Flags),
    memos: parseMemos(tx),
  });
}

export default parseAmmDeposit;
