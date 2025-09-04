import * as assert from "assert";
import { PaymentFlags, Payment } from "xrpl";
import { isPartialPayment } from "../utils";
import { removeUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import parseTxPaymentFlags from "../ledger/tx-payment-flags";
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
function parsePayment(tx: Payment, nativeCurrency?: string): FormattedPaymentSpecification {
  assert.ok(tx.TransactionType === "Payment");

  return removeUndefined({
    source: parseSourceWithAmount(tx),
    destination: parseDestination(tx),
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
    invoiceID: tx.InvoiceID,
    paths: tx.Paths ? JSON.stringify(tx.Paths) : undefined,
    emittedDetails: parseEmittedDetails(tx),
    flags: parseTxPaymentFlags(tx.Flags as number, { nativeCurrency }),
    memos: parseMemos(tx),

    allowPartialPayment: isPartialPayment(tx) || undefined, // @deprecated, use flags.partialPayment
    noDirectRipple: isNoDirectRipple(tx) || undefined, // @deprecated, use flags.noRippleDirect
    limitQuality: isQualityLimited(tx) || undefined, // @deprecated, use flags.limitQuality
  });
}

export default parsePayment;
