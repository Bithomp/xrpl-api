import { IssuedCurrencyAmount, FormattedIssuedCurrencyAmount } from "./amounts";

export type Adjustment = {
  address: string;
  amount: IssuedCurrencyAmount | FormattedIssuedCurrencyAmount; // @deprecated FormattedIssuedCurrencyAmount
  tag?: number;
};

export type MaxAdjustment = {
  address: string;
  maxAmount: IssuedCurrencyAmount | FormattedIssuedCurrencyAmount; // @deprecated FormattedIssuedCurrencyAmount
  tag?: number;
};

export type MinAdjustment = {
  address: string;
  minAmount: IssuedCurrencyAmount | FormattedIssuedCurrencyAmount; // @deprecated FormattedIssuedCurrencyAmount
  tag?: number;
};
