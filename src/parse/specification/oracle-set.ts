import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseSource } from "../ledger/source";
import { parsePriceDataSeries } from "../outcome/oracle_changes";
import { FormattedOracleSetSpecification } from "../../types/oracle";

function parseDidSet(tx: any): FormattedOracleSetSpecification {
  assert.ok(tx.TransactionType === "OracleSet");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    source: parseSource(tx),
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
