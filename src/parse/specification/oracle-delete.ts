import * as assert from "assert";
import { OracleDelete } from "xrpl";
import { removeUndefined } from "../../common";
import { parseTxGlobalFlags } from "../ledger/tx-global-flags";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";
import { FormattedOracleDeleteSpecification } from "../../types/oracle";

function parseDidDelete(tx: OracleDelete, nativeCurrency?: string): FormattedOracleDeleteSpecification {
  assert.ok(tx.TransactionType === "OracleDelete");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
    source: parseSource(tx),
    oracleDocumentID: tx.OracleDocumentID,
    flags: parseTxGlobalFlags(tx.Flags as number, { nativeCurrency }),
    memos: parseMemos(tx),
  });
}

export default parseDidDelete;
