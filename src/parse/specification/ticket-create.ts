import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";

import { FormattedTicketCreateSpecification } from "../../types/tickets";

function parseTicketCreate(tx: any): FormattedTicketCreateSpecification {
  assert.ok(tx.TransactionType === "TicketCreate");

  return removeUndefined({
    ticketCount: tx.TicketCount,
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseTicketCreate;
