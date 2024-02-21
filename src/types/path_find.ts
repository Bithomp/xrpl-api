import { FormattedIssuedCurrencyAmount } from "./amounts";
import { Adjustment, MaxAdjustment, MinAdjustment } from "./adjustments";

// Amount where counterparty and value are optional
export type LaxLaxAmount = {
  currency: string;
  value?: string;
  issuer?: string;
  counterparty?: string;
};

export type Path = {
  source: Adjustment | MaxAdjustment;
  destination: Adjustment | MinAdjustment;
  paths: string;
};

export type GetPaths = Path[];

export type PathFind = {
  source: {
    address: string;
    amount?: FormattedIssuedCurrencyAmount;
    currencies?: { currency: string; counterparty?: string }[];
  };
  destination: {
    address: string;
    amount: LaxLaxAmount;
  };
};
