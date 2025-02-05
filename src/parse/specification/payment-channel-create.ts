import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseTimestamp } from "../utils";
import parseAmount from "../ledger/amount";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseAccount } from "../ledger/account";
import { FormattedSourceAddress, FormattedDestinationAddress } from "../../types/account";
import { FormattedPaymentChannelCreateSpecification } from "../../types/payment_channels";

function parsePaymentChannelCreate(tx: any): FormattedPaymentChannelCreateSpecification {
  assert.ok(tx.TransactionType === "PaymentChannelCreate");

  const source: FormattedSourceAddress = {
    address: parseAccount(tx.Account),
    tag: tx.SourceTag,
  };

  const destination: FormattedDestinationAddress = {
    address: tx.Destination,
    tag: tx.DestinationTag,
  };

  return removeUndefined({
    source: removeUndefined(source),
    destination: removeUndefined(destination),
    amount: parseAmount(tx.Amount), // Legacy support
    settleDelay: tx.SettleDelay,
    publicKey: tx.PublicKey,
    cancelAfter: tx.CancelAfter && parseTimestamp(tx.CancelAfter),
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parsePaymentChannelCreate;
