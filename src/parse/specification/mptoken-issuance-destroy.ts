import * as assert from "assert";
import { MPTokenIssuanceDestroy } from "xrpl";
import { removeUndefined } from "../../common";
import { parseTxGlobalFlags } from "../ledger/tx-global-flags";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";
import { FormattedMPTokenIssuanceDestroySpecification } from "../../types/mptokens";

function parseMPTokenIssuanceCreate(tx: MPTokenIssuanceDestroy, nativeCurrency?: string): FormattedMPTokenIssuanceDestroySpecification {
  assert.ok(tx.TransactionType === "MPTokenIssuanceDestroy");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
    source: parseSource(tx),
    mptIssuanceID: tx.MPTokenIssuanceID,
    flags: parseTxGlobalFlags(tx.Flags as number, { nativeCurrency }),
    memos: parseMemos(tx),
  });
}

export default parseMPTokenIssuanceCreate;
