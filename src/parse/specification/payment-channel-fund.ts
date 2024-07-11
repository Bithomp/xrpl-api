import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseTimestamp } from "../utils";
import parseRippledAmount from "../ledger/ripple-amount";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";

import { FormattedPaymentChannelFundSpecification } from "../../types/payment_channels";

function parsePaymentChannelFund(tx: any): FormattedPaymentChannelFundSpecification {
  assert.ok(tx.TransactionType === "PaymentChannelFund");

  return removeUndefined({
    channel: tx.Channel,
    amount: parseRippledAmount(tx.Amount), // Legacy support
    expiration: tx.Expiration && parseTimestamp(tx.Expiration),
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parsePaymentChannelFund;
