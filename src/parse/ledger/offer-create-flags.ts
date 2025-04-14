import { OfferCreateFlagsKeys, OfferCreateFlagsKeysInterface } from "../../types/offers";
import { parseFlags } from "./flags";

function parseOfferCreateFlags(value: number, options: { excludeFalse?: boolean } = {}): OfferCreateFlagsKeysInterface {
  return parseFlags(value, OfferCreateFlagsKeys, options);
}

export default parseOfferCreateFlags;
