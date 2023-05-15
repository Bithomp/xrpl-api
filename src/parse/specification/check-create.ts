import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseTimestamp } from "../utils";
import parseAmount from "../ledger/amount";
import parseMemos from "../ledger/memos";

import { FormattedCheckCreateSpecification } from "../../v1/common/types/objects/checks";

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
