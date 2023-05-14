import * as common from "../../v1/common";
import { Amount, RippledAmount } from "../../v1/common/types/objects";

function parseAmount(amount: RippledAmount): Amount {
  if (typeof amount === "string") {
    return {
      currency: "XRP",
      value: common.dropsToXrp(amount),
    };
  }
  return {
    currency: amount.currency,
    value: amount.value,
    counterparty: amount.issuer,
  };
}

export default parseAmount;
