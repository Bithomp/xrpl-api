import * as assert from "assert";
import { MPTokenIssuanceSet } from "xrpl";
import { removeUndefined } from "../../common";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";
import parseMPTokenIssuanceSetFlags from "../ledger/mptoken-issuance-set-flags";
import { FormattedMPTokenIssuanceSetSpecification } from "../../types/mptokens";

function parseMPTokenIssuanceCreate(tx: MPTokenIssuanceSet): FormattedMPTokenIssuanceSetSpecification {
  assert.ok(tx.TransactionType === "MPTokenIssuanceSet");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
    source: parseSource(tx),
    flags: parseMPTokenIssuanceSetFlags(tx.Flags as number),
    holder: tx.Holder,
    mptIssuanceID: tx.MPTokenIssuanceID,
    memos: parseMemos(tx),
  });
}

export default parseMPTokenIssuanceCreate;
