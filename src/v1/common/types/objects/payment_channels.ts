import { FormattedBaseSpecification } from "./specification";
import { FormattedAmount } from "../../../../types";
import { DestinationPaymentAddress } from "./account";

export type FormattedPaymentChannelClaimSpecification = {
  channel: string;
  balance?: FormattedAmount;
  amount?: FormattedAmount;
  signature: string;
  publicKey: string;
  renew?: boolean;
  close?: boolean;
} & FormattedBaseSpecification;

export type FormattedPaymentChannelCreateSpecification = {
  amount?: FormattedAmount;
  destination: DestinationPaymentAddress;
  settleDelay: number;
  publicKey?: string;
  cancelAfter?: string;
} & FormattedBaseSpecification;

export type FormattedPaymentChannelFundSpecification = {
  channel: string;
  amount?: FormattedAmount;
  expiration?: string;
} & FormattedBaseSpecification;
