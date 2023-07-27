import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseTimestamp } from "../utils";
import parseRippledAmount from "../ledger/ripple-amount";
import parseMemos from "../ledger/memos";
import { FormattedPaymentChannelCreateSpecification } from "../../v1/common/types/objects/payment_channels";
import { SourcePaymentAddress, DestinationPaymentAddress } from "../../v1/common/types/objects/account";

function parsePaymentChannelCreate(tx: any): FormattedPaymentChannelCreateSpecification {
  assert.ok(tx.TransactionType === "PaymentChannelCreate");

  const source: SourcePaymentAddress = {
    address: tx.Account,
    tag: tx.SourceTag,
  };

  const destination: DestinationPaymentAddress = {
    address: tx.Destination,
    tag: tx.DestinationTag,
  };

  return removeUndefined({
    source: removeUndefined(source),
    memos: parseMemos(tx),
    amount: parseRippledAmount(tx.Amount), // Legacy support
    destination: removeUndefined(destination),
    settleDelay: tx.SettleDelay,
    publicKey: tx.PublicKey,
    cancelAfter: tx.CancelAfter && parseTimestamp(tx.CancelAfter),
  });
}

export default parsePaymentChannelCreate;
