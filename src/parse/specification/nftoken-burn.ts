import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseMemos from "../ledger/memos";
import { FormattedNFTokenBurnSpecification } from "../../v1/common/types/objects/nftokens";
import { SourcePaymentAddress } from "../../v1/common/types/objects/account";

function parseNFTokenBurn(tx: any): FormattedNFTokenBurnSpecification {
  assert.ok(tx.TransactionType === "NFTokenBurn");

  const source: SourcePaymentAddress = {
    address: tx.Account,
    tag: tx.SourceTag,
  };

  return removeUndefined({
    source: removeUndefined(source),
    nftokenID: tx.NFTokenID,
    memos: parseMemos(tx),
  });
}

export default parseNFTokenBurn;
