import { IssuedCurrency, FormattedIssuedCurrency } from "./amounts";

type FormattedGatewayBalanceObligations = {
  currency: string;
  value: string;
};

export type FormattedGatewayBalances = {
  balances?: IssuedCurrency[] | FormattedIssuedCurrency[];
  assets?: IssuedCurrency[] | FormattedIssuedCurrency[];
  obligations?: FormattedGatewayBalanceObligations[];
};
