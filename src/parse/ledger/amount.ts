import { dropsToXrp } from "../../common";
import { FormattedIssuedCurrencyAmount, Amount } from "../../types/objects";

import { getNativeCurrency } from "../../client";

function parseAmount(amount: Amount): FormattedIssuedCurrencyAmount {
  if (typeof amount === "string") {
    return {
      currency: getNativeCurrency(),
      value: dropsToXrp(amount),
    };
  }
  return {
    currency: amount.currency,
    value: amount.value,
    counterparty: amount.issuer,
  };
}

export default parseAmount;
