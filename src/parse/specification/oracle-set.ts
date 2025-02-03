import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseMemos } from "../ledger/memos";
import { parseAccount } from "../ledger/account";
import { parsePriceDataSeries } from "../outcome/oracle_changes";
import { FormattedSourceAddress } from "../../types/account";
import { FormattedOracleSetSpecification } from "../../types/oracle";

function parseDidSet(tx: any): FormattedOracleSetSpecification {
  assert.ok(tx.TransactionType === "OracleSet");

  const source: FormattedSourceAddress = removeUndefined({
    address: parseAccount(tx.Account),
    tag: tx.SourceTag,
  });

  return removeUndefined({
    source: Object.keys(source).length > 0 ? source : undefined,
    oracleDocumentID: tx.OracleDocumentID,
    provider: tx.Provider,
    uri: tx.URI,
    assetClass: tx.AssetClass,
    lastUpdateTime: tx.LastUpdateTime,
    priceDataSeries: tx.PriceDataSeries ? tx.PriceDataSeries.map(parsePriceDataSeries) : undefined,
    memos: parseMemos(tx),
  });
}

export default parseDidSet;
