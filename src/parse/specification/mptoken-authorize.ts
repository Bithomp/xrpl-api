import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseMemos } from "../ledger/memos";
import parseMPTokenAuthorizeFlags from "../ledger/mptoken-authorize-flags";
import { parseAccount } from "../ledger/account";
import { FormattedSourceAddress } from "../../types/account";
import { FormattedMPTokenAuthorizeSpecification } from "../../types/mptokens";

function parseMPTokenAuthorize(tx: any): FormattedMPTokenAuthorizeSpecification {
  assert.ok(tx.TransactionType === "MPTokenAuthorize");

  const source: FormattedSourceAddress = removeUndefined({
    address: parseAccount(tx.Account),
    tag: tx.SourceTag,
  });

  return removeUndefined({
    source: Object.keys(source).length > 0 ? source : undefined,
    flags: parseMPTokenAuthorizeFlags(tx.Flags),
    holder: tx.Holder,
    mptIssuanceID: tx.MPTokenIssuanceID,

    memos: parseMemos(tx),
  });
}

export default parseMPTokenAuthorize;
