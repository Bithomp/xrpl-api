import { FormattedGatewayBalances } from "../../types";
import { GatewayBalances } from "../../models/gateway_balances";

export function parseGatewayBalances(balanceSheet: GatewayBalances): FormattedGatewayBalances {
  const result: FormattedGatewayBalances = {};

  if (typeof balanceSheet.balances === "object") {
    Object.entries(balanceSheet.balances).forEach((entry) => {
      const [issuer, balances] = entry;
      balances.forEach((balance) => {
        if (!result.balances) {
          result.balances = [];
        }

        // counterparty is deprecated
        result.balances.push(Object.assign({ issuer, counterparty: issuer }, balance));
      });
    });
  }
  if (typeof balanceSheet.assets === "object") {
    Object.entries(balanceSheet.assets).forEach(([issuer, assets]) => {
      assets.forEach((balance) => {
        if (!result.assets) {
          result.assets = [];
        }

        // counterparty is deprecated
        result.assets.push(Object.assign({ issuer, counterparty: issuer }, balance));
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
