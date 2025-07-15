import * as assert from "assert";
import { NFTokenModify } from "xrpl";
import { removeUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";
import { FormattedNFTokenModifySpecification } from "../../types/nftokens";

function parseNFTokenModify(tx: NFTokenModify): FormattedNFTokenModifySpecification {
  assert.ok(tx.TransactionType === "NFTokenModify");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
    source: parseSource(tx),

    nftokenID: tx.NFTokenID,
    owner: tx.Owner,
    uri: tx.URI,

    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseNFTokenModify;
