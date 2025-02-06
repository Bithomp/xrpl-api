import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseAmount from "../ledger/amount";
import parseAsset from "../ledger/asset";
import parseAuthAccounts from "../ledger/auth-accounts";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseSource } from "../ledger/source";
import { FormattedAmmBidSpecification } from "../../types/amm";

function parseAmmBid(tx: any): FormattedAmmBidSpecification {
  assert.ok(tx.TransactionType === "AMMBid");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    source: parseSource(tx),
    asset: parseAsset(tx.Asset),
    asset2: parseAsset(tx.Asset2),
    bidMin: tx.BidMin ? parseAmount(tx.BidMin) : undefined,
    bidMax: tx.BidMax ? parseAmount(tx.BidMax) : undefined,
    authAccounts: parseAuthAccounts(tx.AuthAccounts),
    memos: parseMemos(tx),
  });
}

export default parseAmmBid;
