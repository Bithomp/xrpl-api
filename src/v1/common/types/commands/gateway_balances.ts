import { FormattedIssuedCurrencyAmount } from "../objects";

export interface GatewayBalancesRequest {
  account: string;
  strict?: boolean;
  hotwallet: string | string[];
  ledger_hash?: string;
  ledger_index?: number | ("validated" | "closed" | "current");
}

export interface GatewayBalancesResponse {
  account: string;
  obligations?: { [currency: string]: string };
  balances?: { [address: string]: FormattedIssuedCurrencyAmount[] };
  assets?: { [address: string]: FormattedIssuedCurrencyAmount[] };
  ledger_hash?: string;
  ledger_current_index?: number;
  ledger_index?: number;
}
