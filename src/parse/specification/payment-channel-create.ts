import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseTimestamp } from "../utils";
import parseRippledAmount from "../ledger/ripple-amount";
import { parseMemos } from "../ledger/memos";
import { parseAccount } from "../ledger/account";
import { FormattedSourceAddress, FormattedDestinationAddress } from "../../v1/common/types/objects/account";
import { FormattedPaymentChannelCreateSpecification } from "../../v1/common/types/objects/payment_channels";

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
    memos: parseMemos(tx),
    amount: parseRippledAmount(tx.Amount), // Legacy support
    settleDelay: tx.SettleDelay,
    publicKey: tx.PublicKey,
    cancelAfter: tx.CancelAfter && parseTimestamp(tx.CancelAfter),
  });
}

export default parsePaymentChannelCreate;
