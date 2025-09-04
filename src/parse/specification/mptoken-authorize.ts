import * as assert from "assert";
import { MPTokenAuthorize } from "xrpl";
import { removeUndefined } from "../../common";
import { parseMemos } from "../ledger/memos";
import parseTxMPTokenAuthorizeFlags from "../ledger/tx-mptoken-authorize-flags";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";
import { FormattedMPTokenAuthorizeSpecification } from "../../types/mptokens";

function parseMPTokenAuthorize(tx: MPTokenAuthorize, nativeCurrency?: string): FormattedMPTokenAuthorizeSpecification {
  assert.ok(tx.TransactionType === "MPTokenAuthorize");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
    source: parseSource(tx),
    flags: parseTxMPTokenAuthorizeFlags(tx.Flags as number, { nativeCurrency }),
    holder: tx.Holder,
    mptIssuanceID: tx.MPTokenIssuanceID,
    memos: parseMemos(tx),
  });
}

export default parseMPTokenAuthorize;
