import { dropsToXrp } from "../../common";
import { FormattedIssuedCurrencyAmount, FormattedIssuedMPTAmount, Amount } from "../../types";

import { getNativeCurrency } from "../../client";

function parseAmount(amount: Amount): FormattedIssuedCurrencyAmount | FormattedIssuedMPTAmount {
  if (typeof amount === "string") {
    return {
      currency: getNativeCurrency(),
      value: dropsToXrp(amount),
    };
  }

  if ("value" in amount && "currency" in amount && "issuer" in amount) {
    return {
      currency: amount.currency,
      value: amount.value,
      counterparty: amount.issuer,
    };
  }

  return amount;
}

export default parseAmount;
