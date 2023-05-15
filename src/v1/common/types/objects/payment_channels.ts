import { FormattedBaseSpecification } from "./specification";
import { RippledAmount } from "./amounts";

export type FormattedPaymentChannelClaimSpecification = {
  channel: string;
  balance?: RippledAmount;
  amount?: RippledAmount;
  signature: string;
  publicKey: string;
  renew?: boolean;
  close?: boolean;
} & FormattedBaseSpecification;

export type FormattedPaymentChannelCreateSpecification = {
  amount?: RippledAmount;
  destination: string;
  settleDelay: number;
  publicKey?: string;
  cancelAfter?: string;
  sourceTag?: number;
  destinationTag?: number;
} & FormattedBaseSpecification;

export type FormattedPaymentChannelFundSpecification = {
  channel: string;
  amount?: RippledAmount;
  expiration?: string;
} & FormattedBaseSpecification;
