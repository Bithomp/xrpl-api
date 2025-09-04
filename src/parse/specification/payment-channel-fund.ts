import * as assert from "assert";
import { PaymentChannelFund } from "xrpl";
import { removeUndefined } from "../../common";
import { parseTimestamp } from "../utils";
import parseAmount from "../ledger/amount";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseTxGlobalFlags } from "../ledger/tx-global-flags";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";
import { FormattedPaymentChannelFundSpecification } from "../../types/payment_channels";

function parsePaymentChannelFund(tx: PaymentChannelFund, nativeCurrency?: string): FormattedPaymentChannelFundSpecification {
  assert.ok(tx.TransactionType === "PaymentChannelFund");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
    source: parseSource(tx),
    channel: tx.Channel,
    amount: parseAmount(tx.Amount),
    expiration: tx.Expiration && parseTimestamp(tx.Expiration),
    emittedDetails: parseEmittedDetails(tx),
    flags: parseTxGlobalFlags(tx.Flags as number, { nativeCurrency }),
    memos: parseMemos(tx),
  });
}

export default parsePaymentChannelFund;
