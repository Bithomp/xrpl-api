import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseMemos } from "../ledger/memos";
import parseMPTokenIssuanceCreateFlags from "../ledger/mptoken-issuance-create-flags";
import { parseAccount } from "../ledger/account";
import { FormattedSourceAddress } from "../../types/account";
import { FormattedMPTokenIssuanceCreateSpecification } from "../../types/mptokens";

function parseMPTokenIssuanceCreate(tx: any): FormattedMPTokenIssuanceCreateSpecification {
  assert.ok(tx.TransactionType === "MPTokenIssuanceCreate");

  const source: FormattedSourceAddress = removeUndefined({
    address: parseAccount(tx.Account),
    tag: tx.SourceTag,
  });

  return removeUndefined({
    source: Object.keys(source).length > 0 ? source : undefined,
    scale: tx.AssetScale,
    flags: parseMPTokenIssuanceCreateFlags(tx.Flags),
    metadata: tx.MPTokenMetadata,
    maximumAmount: tx.MaximumAmount,
    transferFee: tx.TransferFee,

    memos: parseMemos(tx),
  });
}

export default parseMPTokenIssuanceCreate;
