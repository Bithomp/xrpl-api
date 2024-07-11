import * as assert from "assert";
import { PaymentFlags } from "xrpl";
import { isPartialPayment, removeGenericCounterparty } from "../utils";
import { removeUndefined } from "../../common";
import parseAmount from "../ledger/amount";
import { parseEmitDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";

import { FormattedPaymentSpecification } from "../../types/payments";
import { FormattedSourceAddress, FormattedDestinationAddress } from "../../types/account";

function isNoDirectRipple(tx: any) {
  // eslint-disable-next-line no-bitwise
  return (tx.Flags & PaymentFlags.tfNoRippleDirect) !== 0;
}

function isQualityLimited(tx: any) {
  // eslint-disable-next-line no-bitwise
  return (tx.Flags & PaymentFlags.tfLimitQuality) !== 0;
}

// Payment specification
function parsePayment(tx: any): FormattedPaymentSpecification {
  assert.ok(tx.TransactionType === "Payment");

  const source: FormattedSourceAddress = {
    address: tx.Account,
    maxAmount: removeGenericCounterparty(parseAmount(tx.SendMax || tx.Amount), tx.Account),
    tag: tx.SourceTag,
  };

  const destination: FormattedDestinationAddress = {
    address: tx.Destination,
    tag: tx.DestinationTag,
  };

  return removeUndefined({
    source: removeUndefined(source),
    destination: removeUndefined(destination),
    invoiceID: tx.InvoiceID,
    paths: tx.Paths ? JSON.stringify(tx.Paths) : undefined,
    allowPartialPayment: isPartialPayment(tx) || undefined,
    noDirectRipple: isNoDirectRipple(tx) || undefined,
    limitQuality: isQualityLimited(tx) || undefined,
    emitDetails: parseEmitDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parsePayment;
