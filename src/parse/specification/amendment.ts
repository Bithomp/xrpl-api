import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseSource } from "../ledger/source";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseTxGlobalFlags } from "../ledger/tx-global-flags";
import { parseMemos } from "../ledger/memos";
import { FormattedAmendmentSpecification } from "../../types/amendments";

function parseAmendment(tx: any, nativeCurrency?: string): FormattedAmendmentSpecification {
  assert.ok(tx.TransactionType === "EnableAmendment");

  return removeUndefined({
    source: parseSource(tx),
    amendment: tx.Amendment,
    emittedDetails: parseEmittedDetails(tx),
    flags: parseTxGlobalFlags(tx.Flags as number, { nativeCurrency }),
    memos: parseMemos(tx),
  });
}

export default parseAmendment;
