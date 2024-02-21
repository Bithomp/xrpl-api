import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseTimestamp } from "../utils";
import parseAmount from "../ledger/amount";
import { parseMemos } from "../ledger/memos";
import { parseAccount } from "../ledger/account";
import { FormattedSourceAddress, FormattedDestinationAddress } from "../../types/objects/account";
import { FormattedCheckCreateSpecification } from "../../types/objects/checks";

function parseCheckCreate(tx: any): FormattedCheckCreateSpecification {
  assert.ok(tx.TransactionType === "CheckCreate");

  const source: FormattedSourceAddress = removeUndefined({
    address: parseAccount(tx.Account),
    tag: tx.SourceTag,
  });

  const destination: FormattedDestinationAddress = removeUndefined({
    address: tx.Destination,
    tag: tx.DestinationTag,
  });

  return removeUndefined({
    source: Object.keys(source).length > 0 ? source : undefined,
    destination: Object.keys(destination).length > 0 ? destination : undefined,
    memos: parseMemos(tx),
    sendMax: parseAmount(tx.SendMax),
    expiration: tx.Expiration && parseTimestamp(tx.Expiration),
    invoiceID: tx.InvoiceID,
  });
}

export default parseCheckCreate;
