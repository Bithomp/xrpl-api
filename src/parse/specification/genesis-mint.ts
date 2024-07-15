import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseGenesisMints } from "../ledger/genesis-mints";
import { FormattedGenesisMintSpecification } from "../../types/genesis_mint";

function parseGenesisMint(tx: any): FormattedGenesisMintSpecification {
  assert.ok(tx.TransactionType === "GenesisMint");

  return removeUndefined({
    genesisMints: parseGenesisMints(tx),
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseGenesisMint;
