import * as common from "../../common";
import { RippledAmount } from "../../common/types/objects";
import parseAmount from "./amount";

function parseRippledAmount(amount: RippledAmount): RippledAmount | undefined {
  if (amount === undefined) {
    return undefined;
  }

  if (typeof amount === "string") {
    return common.dropsToXrp(amount);
  }

  return parseAmount(amount);
}

export default parseRippledAmount;
