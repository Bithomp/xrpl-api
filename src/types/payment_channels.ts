import { FormattedBaseSpecification } from "./specification";
import { FormattedAmount } from "./amounts";
import { FormattedSourceAddress, FormattedDestinationAddress } from "./account";

export type FormattedPaymentChannelClaimSpecification = {
  channel: string;
  balance?: FormattedAmount;
  amount?: FormattedAmount;
  renew?: boolean;
  close?: boolean;
} & FormattedBaseSpecification;

export type FormattedPaymentChannelCreateSpecification = {
  source?: FormattedSourceAddress;
  destination?: FormattedDestinationAddress;
  amount?: FormattedAmount;
  settleDelay: number;
  publicKey?: string;
  cancelAfter?: string | number;
} & FormattedBaseSpecification;

export type FormattedPaymentChannelFundSpecification = {
  channel: string;
  amount?: FormattedAmount;
  expiration?: string | number;
} & FormattedBaseSpecification;
