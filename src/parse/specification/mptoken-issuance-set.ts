import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseSource } from "../ledger/source";
import parseMPTokenIssuanceSetFlags from "../ledger/mptoken-issuance-set-flags";
import { FormattedMPTokenIssuanceSetSpecification } from "../../types/mptokens";

function parseMPTokenIssuanceCreate(tx: any): FormattedMPTokenIssuanceSetSpecification {
  assert.ok(tx.TransactionType === "MPTokenIssuanceSet");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    source: parseSource(tx),
    flags: parseMPTokenIssuanceSetFlags(tx.Flags),
    holder: tx.Holder,
    mptIssuanceID: tx.MPTokenIssuanceID,
    memos: parseMemos(tx),
  });
}

export default parseMPTokenIssuanceCreate;
