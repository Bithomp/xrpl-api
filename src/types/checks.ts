import { FormattedBaseSpecification } from "./specification";
import { IssuedCurrencyAmount, FormattedIssuedCurrencyAmount, FormattedIssuedMPTAmount } from "./amounts";
import { FormattedSourceAddress, FormattedDestinationAddress } from "./account";

export type FormattedCheckCancelSpecification = {
  // ID of the Check ledger object to cancel.
  checkID: string;
} & FormattedBaseSpecification;

export type FormattedCheckCashSpecification = {
  // ID of the Check ledger object to cash.
  checkID: string;

  // (Optional) redeem the Check for exactly this amount, if possible.
  // The currency must match that of the `SendMax` of the corresponding
  // `CheckCreate` transaction.
  amount?: IssuedCurrencyAmount | FormattedIssuedCurrencyAmount | FormattedIssuedMPTAmount | string;

  // (Optional) redeem the Check for at least this amount and
  // for as much as possible.
  // The currency must match that of the `SendMax` of the corresponding
  // `CheckCreate` transaction.
  deliverMin?: IssuedCurrencyAmount | FormattedIssuedCurrencyAmount | FormattedIssuedMPTAmount | string;

  // *must* include either Amount or DeliverMin, but not both.
} & FormattedBaseSpecification;

export type FormattedCheckCreateSpecification = {
  source?: FormattedSourceAddress;
  destination?: FormattedDestinationAddress;

  // amount the check is allowed to debit the sender,
  // including transfer fees on non-XRP currencies.
  sendMax?: IssuedCurrencyAmount | FormattedIssuedCurrencyAmount | FormattedIssuedMPTAmount | string;

  // (Optional) time in seconds since the Ripple Epoch.
  expiration?: string | number;
} & FormattedBaseSpecification;
