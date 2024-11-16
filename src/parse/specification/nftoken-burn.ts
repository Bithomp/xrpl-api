import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { FormattedSourceAddress } from "../../types/account";
import { FormattedNFTokenBurnSpecification } from "../../types/nftokens";

function parseNFTokenBurn(tx: any): FormattedNFTokenBurnSpecification {
  assert.ok(tx.TransactionType === "NFTokenBurn");

  const source: FormattedSourceAddress = {
    address: tx.Account,
    tag: tx.SourceTag,
  };

  return removeUndefined({
    source: Object.keys(source).length > 0 ? source : undefined,
    account: tx.Account,
    nftokenID: tx.NFTokenID,
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseNFTokenBurn;
