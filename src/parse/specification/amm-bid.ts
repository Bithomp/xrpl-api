import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseAmount from "../ledger/amount";
import parseAsset from "../ledger/asset";
import parseAuthAccounts from "../ledger/auth-accounts";
import { parseEmitDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseAccount } from "../ledger/account";
import { FormattedSourceAddress } from "../../types/account";
import { FormattedAmmBidSpecification } from "../../types/amm";

function parseAmmBid(tx: any): FormattedAmmBidSpecification {
  assert.ok(tx.TransactionType === "AMMBid");

  const source: FormattedSourceAddress = removeUndefined({
    address: parseAccount(tx.Account),
    tag: tx.SourceTag,
  });

  return removeUndefined({
    source: Object.keys(source).length > 0 ? source : undefined,
    asset: parseAsset(tx.Asset),
    asset2: parseAsset(tx.Asset2),
    bidMin: tx.BidMin ? parseAmount(tx.BidMin) : undefined,
    bidMax: tx.BidMax ? parseAmount(tx.BidMax) : undefined,
    authAccounts: parseAuthAccounts(tx.AuthAccounts),
    emitDetails: parseEmitDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseAmmBid;
