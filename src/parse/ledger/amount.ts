import { dropsToXrp } from "../../common";
import { Amount, RippledAmount } from "../../v1/common/types/objects";

function parseAmount(amount: RippledAmount): Amount {
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
