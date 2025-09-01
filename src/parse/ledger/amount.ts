import { dropsToXrp } from "../../common";
import { IssuedCurrencyAmount, FormattedIssuedCurrencyAmount, FormattedIssuedMPTAmount, Amount } from "../../types";

import { getNativeCurrency } from "../../client";

function parseAmount(amount: Amount): IssuedCurrencyAmount | FormattedIssuedCurrencyAmount | FormattedIssuedMPTAmount {
  // convert drops to XRP object format
  if (typeof amount === "string") {
    return {
      currency: getNativeCurrency(),
      value: dropsToXrp(amount),
    };
  }

  // IssuedCurrencyAmount + FormattedIssuedCurrencyAmount format
  if (amount && "value" in amount && "currency" in amount && "issuer" in amount) {
    return {
      issuer: amount.issuer,
      currency: amount.currency,
      value: amount.value,
      counterparty: amount.issuer, // @deprecated, use issuer
    };
  }

  // return as copy of the original object, including MPT format
  if (amount && typeof amount === "object") {
    return { ...amount };
  }

  // unexpected format
  return amount;
}

export default parseAmount;
