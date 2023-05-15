import { FormattedIssuedCurrencyAmount, Adjustment, MaxAdjustment, MinAdjustment } from ".";

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

// tslint:disable-next-line:array-type
export type GetPaths = Array<Path>;

export type PathFind = {
  source: {
    address: string;
    amount?: FormattedIssuedCurrencyAmount;
    // tslint:disable-next-line:array-type
    currencies?: Array<{ currency: string; counterparty?: string }>;
  };
  destination: {
    address: string;
    amount: LaxLaxAmount;
  };
};
