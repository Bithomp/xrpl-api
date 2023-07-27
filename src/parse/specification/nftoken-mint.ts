import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseMemos from "../ledger/memos";
import parseNFTokenFlags from "../ledger/nftoken-flags";

import { FormattedNFTokenMintSpecification } from "../../v1/common/types/objects/nftokens";
import { SourcePaymentAddress } from "../../v1/common/types/objects/account";

function parseNFTokenMint(tx: any): FormattedNFTokenMintSpecification {
  assert.ok(tx.TransactionType === "NFTokenMint");

  const source: SourcePaymentAddress = {
    address: tx.Account,
    tag: tx.SourceTag,
  };

  return removeUndefined({
    source: removeUndefined(source),
    nftokenTaxon: tx.NFTokenTaxon,
    issuer: tx.Issuer,
    transferFee: tx.TransferFee,
    uri: tx.URI,
    flags: parseNFTokenFlags(tx.Flags),
    memos: parseMemos(tx),
  });
}

export default parseNFTokenMint;
