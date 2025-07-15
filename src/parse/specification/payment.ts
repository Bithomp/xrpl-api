import * as assert from "assert";
import { PaymentFlags, Payment } from "xrpl";
import { isPartialPayment } from "../utils";
import { removeUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSourceWithAmount } from "../ledger/source";
import { parseDestination } from "../ledger/destination";

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
function parsePayment(tx: Payment): FormattedPaymentSpecification {
  assert.ok(tx.TransactionType === "Payment");

  return removeUndefined({
    source: parseSourceWithAmount(tx),
    destination: parseDestination(tx),
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
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
