import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseMemos } from "../ledger/memos";
import parseMPTokenIssuanceSetFlags from "../ledger/mptoken-issuance-set-flags";
import { parseAccount } from "../ledger/account";
import { FormattedSourceAddress } from "../../types/account";
import { FormattedMPTokenIssuanceSetSpecification } from "../../types/mptokens";

function parseMPTokenIssuanceCreate(tx: any): FormattedMPTokenIssuanceSetSpecification {
  assert.ok(tx.TransactionType === "MPTokenIssuanceSet");

  const source: FormattedSourceAddress = removeUndefined({
    address: parseAccount(tx.Account),
    tag: tx.SourceTag,
  });

  return removeUndefined({
    source: Object.keys(source).length > 0 ? source : undefined,
    flags: parseMPTokenIssuanceSetFlags(tx.Flags),
    holder: tx.Holder,
    mptIssuanceID: tx.MPTokenIssuanceID,

    memos: parseMemos(tx),
  });
}

export default parseMPTokenIssuanceCreate;
