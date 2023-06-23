import { dropsToXrp } from "../../common";
import { FormattedIssuedCurrencyAmount, Amount } from "../../v1/common/types/objects";

function parseAmount(amount: Amount): FormattedIssuedCurrencyAmount {
  if (typeof amount === "string") {
    return {
      currency: "XRP",
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