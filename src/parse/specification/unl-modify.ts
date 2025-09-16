import * as assert from "assert";
import { UNLModify } from "xrpl";
import { encodeNodePublic } from "ripple-address-codec";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseSource } from "../ledger/source";
import { FormattedUNLModifySpecification } from "../../types/unl_modify";

function parseUNLModify(tx: UNLModify): FormattedUNLModifySpecification {
  assert.ok(tx.TransactionType === "UNLModify");

  return {
    source: parseSource(tx),
    nUNL: tx.UNLModifyDisabling === 1, // 0 is removed from nUNL, 1 is added to nUNL
    PublicKey: tx.UNLModifyValidator,
    publicKey: encodeNodePublic(Buffer.from(tx.UNLModifyValidator, "hex")),
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  };
}

export default parseUNLModify;
