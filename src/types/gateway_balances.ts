import { FormattedIssuedCurrency } from "./amounts";

type FormattedGatewayBalanceObligations = {
  currency: string;
  value: string;
};

export type FormattedGatewayBalances = {
  balances?: FormattedIssuedCurrency[];
  assets?: FormattedIssuedCurrency[];
  obligations?: FormattedGatewayBalanceObligations[];
};
