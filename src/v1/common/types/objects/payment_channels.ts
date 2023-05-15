import { FormattedBaseSpecification } from "./specification";
import { FormattedAmount } from "../../../../types";

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
  destination: string;
  settleDelay: number;
  publicKey?: string;
  cancelAfter?: string;
  sourceTag?: number;
  destinationTag?: number;
} & FormattedBaseSpecification;

export type FormattedPaymentChannelFundSpecification = {
  channel: string;
  amount?: FormattedAmount;
  expiration?: string;
} & FormattedBaseSpecification;
