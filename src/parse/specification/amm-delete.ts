import * as assert from "assert";
import { AMMDelete } from "xrpl";
import { removeUndefined } from "../../common";
import parseAsset from "../ledger/asset";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";
import { FormattedAmmDeleteSpecification } from "../../types/amm";

function parseAmmDelete(tx: AMMDelete): FormattedAmmDeleteSpecification {
  assert.ok(tx.TransactionType === "AMMDelete");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
    source: parseSource(tx),
    asset: parseAsset(tx.Asset as any),
    asset2: parseAsset(tx.Asset2 as any),
    memos: parseMemos(tx),
  });
}

export default parseAmmDelete;
