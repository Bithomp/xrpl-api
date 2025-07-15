import * as assert from "assert";
import { MPTokenIssuanceCreate } from "xrpl";
import { removeUndefined } from "../../common";
import { parseMemos } from "../ledger/memos";
import parseMPTokenIssuanceCreateFlags from "../ledger/mptoken-issuance-create-flags";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";
import { FormattedMPTokenIssuanceCreateSpecification } from "../../types/mptokens";

function parseMPTokenIssuanceCreate(tx: MPTokenIssuanceCreate): FormattedMPTokenIssuanceCreateSpecification {
  assert.ok(tx.TransactionType === "MPTokenIssuanceCreate");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
    source: parseSource(tx),
    scale: tx.AssetScale,
    flags: parseMPTokenIssuanceCreateFlags(tx.Flags as number),
    metadata: tx.MPTokenMetadata,
    maximumAmount: tx.MaximumAmount,
    transferFee: tx.TransferFee,
    memos: parseMemos(tx),
  });
}

export default parseMPTokenIssuanceCreate;
