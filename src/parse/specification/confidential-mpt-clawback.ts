import * as assert from "assert";
import { removeUndefined, emptyObjectToUndefined } from "../../common";
import { parseTxGlobalFlags } from "../ledger/tx-global-flags";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";
import { FormattedConfidentialMPTClawbackSpecification } from "../../types/mptokens";

function parseConfidentialMPTClawback(tx: any, nativeCurrency?: string): FormattedConfidentialMPTClawbackSpecification {
  assert.ok(tx.TransactionType === "ConfidentialMPTClawback");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
    source: parseSource(tx),
    holder: tx.Holder,
    amount: {
      value: tx.MPTAmount,
      mpt_issuance_id: tx.MPTokenIssuanceID,
    },
    zkProof: tx.ZKProof,
    flags: emptyObjectToUndefined(parseTxGlobalFlags(tx.Flags as number, { nativeCurrency })),
    memos: parseMemos(tx),
  });
}

export default parseConfidentialMPTClawback;
