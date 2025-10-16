import * as assert from "assert";
import { removeUndefined, emptyObjectToUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseTxGlobalFlags } from "../ledger/tx-global-flags";
import { parseMemos } from "../ledger/memos";
import { parseSource } from "../ledger/source";
import { parseGenesisMints } from "../ledger/genesis-mints";
import { FormattedGenesisMintSpecification } from "../../types/genesis_mint";

function parseGenesisMint(tx: any, nativeCurrency?: string): FormattedGenesisMintSpecification {
  assert.ok(tx.TransactionType === "GenesisMint");

  return removeUndefined({
    source: parseSource(tx),
    genesisMints: parseGenesisMints(tx),
    emittedDetails: parseEmittedDetails(tx),
    flags: emptyObjectToUndefined(parseTxGlobalFlags(tx.Flags as number, { nativeCurrency })),
    memos: parseMemos(tx),
  });
}

export default parseGenesisMint;
