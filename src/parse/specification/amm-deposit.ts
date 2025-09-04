import * as assert from "assert";
import { AMMDeposit } from "xrpl";
import { removeUndefined } from "../../common";
import parseAmount from "../ledger/amount";
import parseAsset from "../ledger/asset";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";
import { FormattedAmmDepositSpecification } from "../../types/amm";
import parseTxAmmDepositFlags from "../ledger/tx-amm-deposit-flags";

function parseAmmDeposit(tx: AMMDeposit, nativeCurrency?: string): FormattedAmmDepositSpecification {
  assert.ok(tx.TransactionType === "AMMDeposit");

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
    lpTokenOut: tx.LPTokenOut ? parseAmount(tx.LPTokenOut) : undefined,
    flags: parseTxAmmDepositFlags(tx.Flags as number, { nativeCurrency }),
    memos: parseMemos(tx),
  });
}

export default parseAmmDeposit;
