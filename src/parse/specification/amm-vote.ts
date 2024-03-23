import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseAsset from "../ledger/asset";
import { parseMemos } from "../ledger/memos";
import { parseAccount } from "../ledger/account";
import { FormattedSourceAddress } from "../../types/account";
import { FormattedAmmVoteSpecification } from "../../types/amm";

function parseAmmVote(tx: any): FormattedAmmVoteSpecification {
  assert.ok(tx.TransactionType === "AMMVote");

  const source: FormattedSourceAddress = removeUndefined({
    address: parseAccount(tx.Account),
    tag: tx.SourceTag,
  });

  return removeUndefined({
    source: Object.keys(source).length > 0 ? source : undefined,
    memos: parseMemos(tx),
    asset: parseAsset(tx.Asset),
    asset2: parseAsset(tx.Asset2),
    tradingFee: tx.TradingFee,
  });
}

export default parseAmmVote;
