import { dropsToXrp } from "../../common";
import { Amount, FormattedAmount } from "../../v1/common/types/objects";
import parseAmount from "./amount";

function parseRippledAmount(amount: Amount): FormattedAmount | undefined {
  if (amount === undefined) {
    return undefined;
  }

  if (typeof amount === "string") {
    return dropsToXrp(amount);
  }

  return parseAmount(amount);
}

export default parseRippledAmount;