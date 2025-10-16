import * as assert from "assert";
import { TicketCreate } from "xrpl";
import { removeUndefined, emptyObjectToUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseTxGlobalFlags } from "../ledger/tx-global-flags";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";
import { FormattedTicketCreateSpecification } from "../../types/tickets";

function parseTicketCreate(tx: TicketCreate, nativeCurrency?: string): FormattedTicketCreateSpecification {
  assert.ok(tx.TransactionType === "TicketCreate");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
    source: parseSource(tx),
    ticketCount: tx.TicketCount,
    emittedDetails: parseEmittedDetails(tx),
    flags: emptyObjectToUndefined(parseTxGlobalFlags(tx.Flags as number, { nativeCurrency })),
    memos: parseMemos(tx),
  });
}

export default parseTicketCreate;
