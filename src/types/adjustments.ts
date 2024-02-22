import { FormattedIssuedCurrencyAmount } from "./amounts";

export type Adjustment = {
  address: string;
  amount: FormattedIssuedCurrencyAmount;
  tag?: number;
};

export type MaxAdjustment = {
  address: string;
  maxAmount: FormattedIssuedCurrencyAmount;
  tag?: number;
};

export type MinAdjustment = {
  address: string;
  minAmount: FormattedIssuedCurrencyAmount;
  tag?: number;
};
