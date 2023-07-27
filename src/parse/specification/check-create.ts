import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseTimestamp, removeGenericCounterparty } from "../utils";
import parseAmount from "../ledger/amount";
import parseMemos from "../ledger/memos";
import { FormattedCheckCreateSpecification } from "../../v1/common/types/objects/checks";
import { SourcePaymentAddress, DestinationPaymentAddress } from "../../v1/common/types/objects/account";

function parseCheckCreate(tx: any): FormattedCheckCreateSpecification {
  assert.ok(tx.TransactionType === "CheckCreate");

  const source: SourcePaymentAddress = {
    address: tx.Account,
    maxAmount: removeGenericCounterparty(parseAmount(tx.SendMax || tx.Amount), tx.Account),
    tag: tx.SourceTag,
  };

  const destination: DestinationPaymentAddress = {
    address: tx.Destination,
    tag: tx.DestinationTag,
  };

  return removeUndefined({
    source: removeUndefined(source),
    memos: parseMemos(tx),
    destination: removeUndefined(destination),
    expiration: tx.Expiration && parseTimestamp(tx.Expiration),
    invoiceID: tx.InvoiceID,
  });
}

export default parseCheckCreate;
