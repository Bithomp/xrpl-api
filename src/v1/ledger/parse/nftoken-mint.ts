import * as assert from "assert";
import parseMemos from "./memos";
import parseNFTokenFlags from "./nftoken-flags";
import { removeUndefined } from "../../common";

import { FormattedNFTokenMintSpecification } from "../../common/types/objects/nftokens";

export function parseNFTokenMint(tx: any): FormattedNFTokenMintSpecification {
  assert.ok(tx.TransactionType === "NFTokenMint");

  return removeUndefined({
    nftokenTaxon: tx.NFTokenTaxon,
    issuer: tx.Issuer,
    transferFee: tx.TransferFee,
    uri: tx.URI,
    flags: parseNFTokenFlags(tx.Flags),
    memos: parseMemos(tx),
  });
}

export default parseNFTokenMint;
