import * as assert from "assert";
import { parseTimestamp } from "./utils";
import { removeUndefined } from "../../common";
import parseAmount from "./amount";
import parseMemos from "./memos";

import { FormattedCheckCreateSpecification } from "../../common/types/objects/checks";

function parseCheckCreate(tx: any): FormattedCheckCreateSpecification {
  assert.ok(tx.TransactionType === "CheckCreate");

  return removeUndefined({
    memos: parseMemos(tx),
    destination: tx.Destination,
    sendMax: parseAmount(tx.SendMax),
    destinationTag: tx.DestinationTag,
    expiration: tx.Expiration && parseTimestamp(tx.Expiration),
    invoiceID: tx.InvoiceID,
  });
}

export default parseCheckCreate;
