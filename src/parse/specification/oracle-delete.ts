import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseSource } from "../ledger/source";
import { FormattedOracleDeleteSpecification } from "../../types/oracle";

function parseDidDelete(tx: any): FormattedOracleDeleteSpecification {
  assert.ok(tx.TransactionType === "OracleDelete");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    source: parseSource(tx),
    oracleDocumentID: tx.OracleDocumentID,
    memos: parseMemos(tx),
  });
}

export default parseDidDelete;
