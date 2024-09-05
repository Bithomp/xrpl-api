import { FormattedGatewayBalances } from "../../types";
import { GatewayBalances } from "../../models/gateway_balances";

export function parseGatewayBalances(balanceSheet: GatewayBalances): FormattedGatewayBalances {
  const result: FormattedGatewayBalances = {};

  if (typeof balanceSheet.balances === "object") {
    Object.entries(balanceSheet.balances).forEach((entry) => {
      const [counterparty, balances] = entry;
      balances.forEach((balance) => {
        if (!result.balances) {
          result.balances = [];
        }

        result.balances.push(Object.assign({ counterparty }, balance));
      });
    });
  }
  if (typeof balanceSheet.assets === "object") {
    Object.entries(balanceSheet.assets).forEach(([counterparty, assets]) => {
      assets.forEach((balance) => {
        if (!result.assets) {
          result.assets = [];
        }

        result.assets.push(Object.assign({ counterparty }, balance));
      });
    });
  }
  if (typeof balanceSheet.obligations === "object") {
    result.obligations = Object.entries(balanceSheet.obligations as { [key: string]: string }).map(
      ([currency, value]) => ({ currency, value })
    );
  }

  return result;
}
