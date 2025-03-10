import { OfferFlagsKeys, OfferFlagsKeysInterface } from "../../types/offers";
import { parseFlags } from "./flags";

function parseOfferFlags(value: number, options: { excludeFalse?: boolean } = {}): OfferFlagsKeysInterface {
  return parseFlags(value, OfferFlagsKeys, options);
}

export default parseOfferFlags;
