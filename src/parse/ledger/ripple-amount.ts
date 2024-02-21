import { dropsToXrp } from "../../common";
import { Amount, FormattedAmount } from "../../types/objects";
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
