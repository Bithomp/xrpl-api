import * as assert from "assert";
import { parseTimestamp } from "./utils";
import { removeUndefined } from "../../common";
import parseRippledAmount from "./ripple-amount";
import parseMemos from "./memos";

import { FormattedPaymentChannelFundSpecification } from "../../common/types/objects/payment_channels";

function parsePaymentChannelFund(tx: any): FormattedPaymentChannelFundSpecification {
  assert.ok(tx.TransactionType === "PaymentChannelFund");

  return removeUndefined({
    memos: parseMemos(tx),
    channel: tx.Channel,
    amount: parseRippledAmount(tx.Amount), // Legacy support
    expiration: tx.Expiration && parseTimestamp(tx.Expiration),
  });
}

export default parsePaymentChannelFund;
