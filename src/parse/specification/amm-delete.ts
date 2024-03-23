import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseAsset from "../ledger/asset";
import { parseMemos } from "../ledger/memos";
import { parseAccount } from "../ledger/account";
import { FormattedSourceAddress } from "../../types/account";
import { FormattedAmmDeleteSpecification } from "../../types/amm";

function parseAmmDelete(tx: any): FormattedAmmDeleteSpecification {
  assert.ok(tx.TransactionType === "AMMDelete");

  const source: FormattedSourceAddress = removeUndefined({
    address: parseAccount(tx.Account),
    tag: tx.SourceTag,
  });

  return removeUndefined({
    source: Object.keys(source).length > 0 ? source : undefined,
    memos: parseMemos(tx),
    asset: parseAsset(tx.Asset),
    asset2: parseAsset(tx.Asset2),
  });
}

export default parseAmmDelete;
