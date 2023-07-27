import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseMemos from "../ledger/memos";
import { FormattedTicketCreateSpecification } from "../../v1/common/types/objects/tickets";
import { SourcePaymentAddress } from "../../v1/common/types/objects/account";

function parseTicketCreate(tx: any): FormattedTicketCreateSpecification {
  assert.ok(tx.TransactionType === "TicketCreate");

  const source: SourcePaymentAddress = {
    address: tx.Account,
    tag: tx.SourceTag,
  };

  return removeUndefined({
    source: removeUndefined(source),
    memos: parseMemos(tx),
    ticketCount: tx.TicketCount,
  });
}

export default parseTicketCreate;
