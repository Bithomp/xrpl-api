import * as assert from "assert";
import { AMMClawback } from "xrpl";
import { removeUndefined } from "../../common";
import parseAmount from "../ledger/amount";
import parseAsset from "../ledger/asset";
import { parseMemos } from "../ledger/memos";
import { parseAccount } from "../ledger/account";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";
import { FormattedAmmClawbackSpecification } from "../../types/amm";
import parseAmmClawbackFlags from "../ledger/amm-clawback-flags";

function parseAmmClawback(tx: AMMClawback): FormattedAmmClawbackSpecification {
  assert.ok(tx.TransactionType === "AMMClawback");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
    source: parseSource(tx),
    asset: parseAsset(tx.Asset),
    asset2: parseAsset(tx.Asset2 as any),
    amount: tx.Amount ? parseAmount(tx.Amount) : undefined,
    holder: tx.Holder ? parseAccount(tx.Holder) : undefined,
    flags: parseAmmClawbackFlags(tx.Flags as number),
    memos: parseMemos(tx),
  });
}

export default parseAmmClawback;
