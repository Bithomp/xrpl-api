import { Amount, RippledAmount } from "../../common/types/objects";
import parseAmount from "./amount";

function parseCurrencyAmount(amount: RippledAmount): Amount | undefined {
  if (amount === undefined) {
    return undefined;
  }

  return parseAmount(amount);
}

export default parseCurrencyAmount;
