import * as assert from "assert";
import { removeUndefined, emptyObjectToUndefined } from "../../common";
import { parseTxGlobalFlags } from "../ledger/tx-global-flags";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";
import { FormattedConfidentialMPTConvertBackSpecification } from "../../types/mptokens";

function parseConfidentialMPTConvertBack(
  tx: any,
  nativeCurrency?: string
): FormattedConfidentialMPTConvertBackSpecification {
  assert.ok(tx.TransactionType === "ConfidentialMPTConvertBack");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
    source: parseSource(tx),
    balanceCommitment: tx.BalanceCommitment,
    blindingFactor: tx.BlindingFactor,
    holderEncryptedAmount: tx.HolderEncryptedAmount,
    issuerEncryptedAmount: tx.IssuerEncryptedAmount,
    amount: {
      value: tx.MPTAmount,
      mpt_issuance_id: tx.MPTokenIssuanceID,
    },
    zkProof: tx.ZKProof,
    flags: emptyObjectToUndefined(parseTxGlobalFlags(tx.Flags as number, { nativeCurrency })),
    memos: parseMemos(tx),
  });
}

export default parseConfidentialMPTConvertBack;
