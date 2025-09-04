import * as assert from "assert";
import { MPTokenIssuanceSet } from "xrpl";
import { removeUndefined } from "../../common";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";
import parseTxMPTokenIssuanceSetFlags from "../ledger/tx-mptoken-issuance-set-flags";
import { FormattedMPTokenIssuanceSetSpecification } from "../../types/mptokens";

function parseMPTokenIssuanceCreate(
  tx: MPTokenIssuanceSet,
  nativeCurrency?: string
): FormattedMPTokenIssuanceSetSpecification {
  assert.ok(tx.TransactionType === "MPTokenIssuanceSet");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
    source: parseSource(tx),
    flags: parseTxMPTokenIssuanceSetFlags(tx.Flags as number, { nativeCurrency }),
    holder: tx.Holder,
    mptIssuanceID: tx.MPTokenIssuanceID,
    memos: parseMemos(tx),
  });
}

export default parseMPTokenIssuanceCreate;
