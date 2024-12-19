import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseMemos } from "../ledger/memos";
import { parseAccount } from "../ledger/account";
import { FormattedSourceAddress } from "../../types/account";
import { FormattedMPTokenIssuanceDestroySpecification } from "../../types/mptokens";

function parseMPTokenIssuanceCreate(tx: any): FormattedMPTokenIssuanceDestroySpecification {
  assert.ok(tx.TransactionType === "MPTokenIssuanceDestroy");

  const source: FormattedSourceAddress = removeUndefined({
    address: parseAccount(tx.Account),
    tag: tx.SourceTag,
  });

  return removeUndefined({
    source: Object.keys(source).length > 0 ? source : undefined,
    mptIssuanceID: tx.MPTokenIssuanceID,

    memos: parseMemos(tx),
  });
}

export default parseMPTokenIssuanceCreate;
