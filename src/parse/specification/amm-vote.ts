import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseAsset from "../ledger/asset";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseSource } from "../ledger/source";
import { FormattedAmmVoteSpecification } from "../../types/amm";

function parseAmmVote(tx: any): FormattedAmmVoteSpecification {
  assert.ok(tx.TransactionType === "AMMVote");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    source: parseSource(tx),
    asset: parseAsset(tx.Asset),
    asset2: parseAsset(tx.Asset2),
    tradingFee: tx.TradingFee,
    memos: parseMemos(tx),
  });
}

export default parseAmmVote;
