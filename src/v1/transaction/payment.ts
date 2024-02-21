import _ from "lodash";
import { PaymentFlags } from "xrpl";
import { TransactionJSON } from "./types";
import {
  FormattedIssuedCurrencyAmount,
  Adjustment,
  MaxAdjustment,
  MinAdjustment,
  FormattedMemo,
} from "../../types/objects";
import { xrpToDrops } from "../../common";
import { getClassicAccountAndTag, ClassicAccountAndTag, toRippledAmount } from "./utils";
import { formattedMemoToMemo } from "../../parse/ledger/memos";

import { getNativeCurrency } from "../../client";

export interface Payment {
  source: Adjustment | MaxAdjustment;
  destination: Adjustment | MinAdjustment;
  paths?: string;
  networkID?: number;
  memos?: FormattedMemo[];
  // A 256-bit hash that can be used to identify a particular payment
  invoiceID?: string;
  // A boolean that, if set to true, indicates that this payment should go
  // through even if the whole amount cannot be delivered because of a lack of
  // liquidity or funds in the source_account account
  allowPartialPayment?: boolean;
  // A boolean that can be set to true if paths are specified and the sender
  // would like the Ripple Network to disregard any direct paths from
  // the source_account to the destination_account. This may be used to take
  // advantage of an arbitrage opportunity or by gateways wishing to issue
  // balances from a hot wallet to a user who has mistakenly set a trustline
  // directly to the hot wallet
  noDirectRipple?: boolean;
  limitQuality?: boolean;
}

function isMaxAdjustment(source: Adjustment | MaxAdjustment): source is MaxAdjustment {
  return (source as MaxAdjustment).maxAmount != null; // eslint-disable-line eqeqeq
}

function isMinAdjustment(destination: Adjustment | MinAdjustment): destination is MinAdjustment {
  return (destination as MinAdjustment).minAmount != null; // eslint-disable-line eqeqeq
}

function isXRPToXRPPayment(payment: Payment): boolean {
  const { source, destination } = payment;
  const sourceCurrency = isMaxAdjustment(source) ? source.maxAmount.currency : source.amount.currency;
  /* eslint-disable multiline-ternary */
  const destinationCurrency = isMinAdjustment(destination)
    ? destination.minAmount.currency
    : destination.amount.currency;
  /* eslint-enable multiline-ternary */
  return (
    (sourceCurrency === getNativeCurrency() || sourceCurrency === "drops") &&
    (destinationCurrency === getNativeCurrency() || destinationCurrency === "drops")
  );
}

function isIOUWithoutCounterparty(amount: FormattedIssuedCurrencyAmount): boolean {
  return (
    // eslint-disable-next-line eqeqeq
    amount && amount.currency !== getNativeCurrency() && amount.currency !== "drops" && amount.counterparty == null
  );
}

function applyAnyCounterpartyEncoding(payment: Payment): void {
  // Convert blank counterparty to sender or receiver's address
  //   (Ripple convention for 'any counterparty')
  // https://developers.ripple.com/payment.html#special-issuer-values-for-sendmax-and-amount
  [payment.source, payment.destination].forEach((adjustment) => {
    ["amount", "minAmount", "maxAmount"].forEach((key) => {
      if (isIOUWithoutCounterparty(adjustment[key])) {
        adjustment[key].counterparty = adjustment.address;
      }
    });
  });
}

function createMaximalAmount(amount: FormattedIssuedCurrencyAmount): FormattedIssuedCurrencyAmount {
  const maxXRPValue = "100000000000";

  // Equivalent to '9999999999999999e80' but we cannot use that because sign()
  // now checks that the encoded representation exactly matches the transaction
  // as it was originally provided.
  const maxIOUValue =
    "999999999999999900000000000000000000000000000000000000000000000000000000000000000000000000000000";

  let maxValue;
  if (amount.currency === getNativeCurrency()) {
    maxValue = maxXRPValue;
  } else if (amount.currency === "drops") {
    maxValue = xrpToDrops(maxXRPValue);
  } else {
    maxValue = maxIOUValue;
  }
  return Object.assign({}, amount, { value: maxValue });
}

/**
 * Given an address and tag:
 * 1. Get the classic account and tag;
 * 2. If a tag is provided:
 *    2a. If the address was an X-address, validate that the X-address has the expected tag;
 *    2b. If the address was a classic address, return `expectedTag` as the tag.
 * 3. If we do not want to use a tag in this case,
 *    set the tag in the return value to `undefined`.
 *
 * @param address The address to parse.
 * @param expectedTag If provided, and the `Account` is an X-address,
 *                    this method throws an error if `expectedTag`
 *                    does not match the tag of the X-address.
 * @returns {ClassicAccountAndTag}
 *          The classic account and tag.
 */
function validateAndNormalizeAddress(address: string, expectedTag: number | undefined): ClassicAccountAndTag {
  const classicAddress = getClassicAccountAndTag(address, expectedTag);
  classicAddress.tag = classicAddress.tag === false ? undefined : classicAddress.tag;
  return classicAddress;
}

export function createPaymentTransaction(address: string, paymentArgument: Payment): TransactionJSON {
  const payment = _.cloneDeep(paymentArgument);
  applyAnyCounterpartyEncoding(payment);

  const sourceAddressAndTag = validateAndNormalizeAddress(payment.source.address, payment.source.tag);
  const addressToVerifyAgainst = validateAndNormalizeAddress(address, undefined);

  if (addressToVerifyAgainst.classicAccount !== sourceAddressAndTag.classicAccount) {
    throw new Error("address must match payment.source.address");
  }

  if (
    addressToVerifyAgainst.tag != null && // eslint-disable-line eqeqeq
    sourceAddressAndTag.tag != null && // eslint-disable-line eqeqeq
    addressToVerifyAgainst.tag !== sourceAddressAndTag.tag
  ) {
    throw new Error("address includes a tag that does not match payment.source.tag");
  }

  const destinationAddressAndTag = validateAndNormalizeAddress(payment.destination.address, payment.destination.tag);

  if (
    (isMaxAdjustment(payment.source) && isMinAdjustment(payment.destination)) ||
    (!isMaxAdjustment(payment.source) && !isMinAdjustment(payment.destination))
  ) {
    throw new Error(
      "payment must specify either (source.maxAmount " +
        "and destination.amount) or (source.amount and destination.minAmount)"
    );
  }

  /* eslint-disable multiline-ternary */
  const destinationAmount = isMinAdjustment(payment.destination)
    ? payment.destination.minAmount
    : payment.destination.amount;
  /* eslint-enable multiline-ternary */

  const sourceAmount = isMaxAdjustment(payment.source) ? payment.source.maxAmount : payment.source.amount;

  // when using destination.minAmount, rippled still requires that we set
  // a destination amount in addition to DeliverMin. the destination amount
  // is interpreted as the maximum amount to send. we want to be sure to
  // send the whole source amount, so we set the destination amount to the
  // maximum possible amount. otherwise it's possible that the destination
  // cap could be hit before the source cap.
  /* eslint-disable multiline-ternary */
  const amount =
    isMinAdjustment(payment.destination) && !isXRPToXRPPayment(payment)
      ? createMaximalAmount(destinationAmount)
      : destinationAmount;
  /* eslint-enable multiline-ternary */

  const txJSON: any = {
    TransactionType: "Payment",
    Account: sourceAddressAndTag.classicAccount,
    Destination: destinationAddressAndTag.classicAccount,
    Amount: toRippledAmount(amount),
    Flags: 0,
  };

  // eslint-disable-next-line eqeqeq
  if (payment.invoiceID != null) {
    txJSON.InvoiceID = payment.invoiceID;
  }
  // eslint-disable-next-line eqeqeq
  if (sourceAddressAndTag.tag != null) {
    txJSON.SourceTag = sourceAddressAndTag.tag;
  }
  // eslint-disable-next-line eqeqeq
  if (destinationAddressAndTag.tag != null) {
    txJSON.DestinationTag = destinationAddressAndTag.tag;
  }
  // eslint-disable-next-line eqeqeq
  if (payment.networkID != null) {
    txJSON.NetworkID = payment.networkID;
  }
  // eslint-disable-next-line eqeqeq
  if (payment.memos != null) {
    txJSON.Memos = payment.memos.map(formattedMemoToMemo);
  }
  if (payment.noDirectRipple === true) {
    // eslint-disable-next-line no-bitwise
    txJSON.Flags |= PaymentFlags.tfNoDirectRipple;
  }
  if (payment.limitQuality === true) {
    // eslint-disable-next-line no-bitwise
    txJSON.Flags |= PaymentFlags.tfLimitQuality;
  }
  if (!isXRPToXRPPayment(payment)) {
    // Don't set SendMax for XRP->XRP payment
    // temREDUNDANT_SEND_MAX removed in:
    // https://github.com/ripple/rippled/commit/
    //  c522ffa6db2648f1d8a987843e7feabf1a0b7de8/
    if (payment.allowPartialPayment || isMinAdjustment(payment.destination)) {
      // eslint-disable-next-line no-bitwise
      txJSON.Flags |= PaymentFlags.tfPartialPayment;
    }

    txJSON.SendMax = toRippledAmount(sourceAmount);

    if (isMinAdjustment(payment.destination)) {
      txJSON.DeliverMin = toRippledAmount(destinationAmount);
    }

    // eslint-disable-next-line eqeqeq
    if (payment.paths != null) {
      txJSON.Paths = JSON.parse(payment.paths);
    }
  } else if (payment.allowPartialPayment === true) {
    throw new Error("XRP to XRP payments cannot be partial payments");
  }

  return txJSON;
}
