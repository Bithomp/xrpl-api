import * as common from "../../v1/common";
import { RippledAmount } from "../../v1/common/types/objects";
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
