import { FormattedAmount, Amount } from "../../types/objects";
import parseAmount from "./amount";

function parseCurrencyAmount(amount: Amount): FormattedAmount | undefined {
  if (amount === undefined) {
    return undefined;
  }

  return parseAmount(amount);
}

export default parseCurrencyAmount;
