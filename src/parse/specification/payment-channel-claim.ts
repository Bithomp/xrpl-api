import * as assert from "assert";
import { PaymentChannelClaimFlags } from "xrpl";
import { removeUndefined } from "../../common";
import parseRippledAmount from "../ledger/ripple-amount";
import { parseEmitDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { FormattedPaymentChannelClaimSpecification } from "../../types/payment_channels";

function parsePaymentChannelClaim(tx: any): FormattedPaymentChannelClaimSpecification {
  assert.ok(tx.TransactionType === "PaymentChannelClaim");

  return removeUndefined({
    channel: tx.Channel,
    balance: parseRippledAmount(tx.Balance), // Legacy support
    amount: parseRippledAmount(tx.Amount), // Legacy support
    signature: tx.Signature,
    publicKey: tx.PublicKey,
    // eslint-disable-next-line no-bitwise
    renew: Boolean(tx.Flags & PaymentChannelClaimFlags.tfRenew) || undefined,
    // eslint-disable-next-line no-bitwise
    close: Boolean(tx.Flags & PaymentChannelClaimFlags.tfClose) || undefined,
    emitDetails: parseEmitDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parsePaymentChannelClaim;
