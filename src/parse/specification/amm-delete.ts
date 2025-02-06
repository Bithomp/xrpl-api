import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseAsset from "../ledger/asset";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseSource } from "../ledger/source";
import { FormattedAmmDeleteSpecification } from "../../types/amm";

function parseAmmDelete(tx: any): FormattedAmmDeleteSpecification {
  assert.ok(tx.TransactionType === "AMMDelete");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    source: parseSource(tx),
    asset: parseAsset(tx.Asset),
    asset2: parseAsset(tx.Asset2),
    memos: parseMemos(tx),
  });
}

export default parseAmmDelete;
