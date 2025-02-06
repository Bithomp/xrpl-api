import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseSource } from "../ledger/source";
import { FormattedMPTokenIssuanceDestroySpecification } from "../../types/mptokens";

function parseMPTokenIssuanceCreate(tx: any): FormattedMPTokenIssuanceDestroySpecification {
  assert.ok(tx.TransactionType === "MPTokenIssuanceDestroy");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    source: parseSource(tx),
    mptIssuanceID: tx.MPTokenIssuanceID,
    memos: parseMemos(tx),
  });
}

export default parseMPTokenIssuanceCreate;
