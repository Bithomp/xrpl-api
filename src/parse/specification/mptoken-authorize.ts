import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseMemos } from "../ledger/memos";
import parseMPTokenAuthorizeFlags from "../ledger/mptoken-authorize-flags";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseSource } from "../ledger/source";
import { FormattedMPTokenAuthorizeSpecification } from "../../types/mptokens";

function parseMPTokenAuthorize(tx: any): FormattedMPTokenAuthorizeSpecification {
  assert.ok(tx.TransactionType === "MPTokenAuthorize");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    source: parseSource(tx),
    flags: parseMPTokenAuthorizeFlags(tx.Flags),
    holder: tx.Holder,
    mptIssuanceID: tx.MPTokenIssuanceID,

    memos: parseMemos(tx),
  });
}

export default parseMPTokenAuthorize;
