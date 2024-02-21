import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseMemos } from "../ledger/memos";

import { FormattedTicketCreateSpecification } from "../../types/objects/tickets";

function parseTicketCreate(tx: any): FormattedTicketCreateSpecification {
  assert.ok(tx.TransactionType === "TicketCreate");

  return removeUndefined({
    memos: parseMemos(tx),
    ticketCount: tx.TicketCount,
  });
}

export default parseTicketCreate;
