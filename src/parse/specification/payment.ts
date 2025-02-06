import * as assert from "assert";
import { PaymentFlags } from "xrpl";
import { isPartialPayment } from "../utils";
import { removeUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";

import { parseSourceWithAmount } from "../ledger/source";
import { parseDestination } from "../ledger/destination";
import { parseSigners } from "../ledger/signers";

import { FormattedPaymentSpecification } from "../../types/payments";

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

  return removeUndefined({
    source: parseSourceWithAmount(tx),
    destination: parseDestination(tx),
    signers: parseSigners(tx),
    invoiceID: tx.InvoiceID,
    paths: tx.Paths ? JSON.stringify(tx.Paths) : undefined,
    allowPartialPayment: isPartialPayment(tx) || undefined,
    noDirectRipple: isNoDirectRipple(tx) || undefined,
    limitQuality: isQualityLimited(tx) || undefined,
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parsePayment;
