import * as assert from "assert";
import { PaymentChannelClaimFlags, PaymentChannelClaim } from "xrpl";
import { removeUndefined } from "../../common";
import parseAmount from "../ledger/amount";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";
import { FormattedPaymentChannelClaimSpecification } from "../../types/payment_channels";
import { Amount } from "../../types";

function parsePaymentChannelClaim(tx: PaymentChannelClaim): FormattedPaymentChannelClaimSpecification {
  assert.ok(tx.TransactionType === "PaymentChannelClaim");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
    source: parseSource(tx),
    channel: tx.Channel,
    balance: parseAmount(tx.Balance as Amount),
    amount: parseAmount(tx.Amount as Amount),
    // eslint-disable-next-line no-bitwise
    renew: Boolean((tx.Flags as number) & PaymentChannelClaimFlags.tfRenew) || undefined,
    // eslint-disable-next-line no-bitwise
    close: Boolean((tx.Flags as number) & PaymentChannelClaimFlags.tfClose) || undefined,
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parsePaymentChannelClaim;
