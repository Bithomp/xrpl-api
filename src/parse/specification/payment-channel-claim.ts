import * as assert from "assert";
import { PaymentChannelClaimFlags } from "xrpl";
import { removeUndefined } from "../../common";
import parseRippledAmount from "../ledger/ripple-amount";
import parseMemos from "../ledger/memos";

import { FormattedPaymentChannelClaimSpecification } from "../../v1/common/types/objects/payment_channels";

function parsePaymentChannelClaim(tx: any): FormattedPaymentChannelClaimSpecification {
  assert.ok(tx.TransactionType === "PaymentChannelClaim");

  return removeUndefined({
    memos: parseMemos(tx),
    channel: tx.Channel,
    balance: parseRippledAmount(tx.Balance), // Legacy support
    amount: parseRippledAmount(tx.Amount), // Legacy support
    signature: tx.Signature,
    publicKey: tx.PublicKey,
    // eslint-disable-next-line no-bitwise
    renew: Boolean(tx.Flags & PaymentChannelClaimFlags.tfRenew) || undefined,
    // eslint-disable-next-line no-bitwise
    close: Boolean(tx.Flags & PaymentChannelClaimFlags.tfClose) || undefined,
  });
}

export default parsePaymentChannelClaim;
