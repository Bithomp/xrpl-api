import * as assert from "assert";
import { removeUndefined, emptyObjectToUndefined } from "../../common";
import { parseTxGlobalFlags } from "../ledger/tx-global-flags";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";
import { FormattedConfidentialMPTConvertSpecification } from "../../types/mptokens";

function parseConfidentialMPTConvert(tx: any, nativeCurrency?: string): FormattedConfidentialMPTConvertSpecification {
  assert.ok(tx.TransactionType === "ConfidentialMPTConvert");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
    source: parseSource(tx),
    holderEncryptedAmount: tx.HolderEncryptedAmount,
    holderEncryptionKey: tx.HolderEncryptionKey,
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

export default parseConfidentialMPTConvert;
