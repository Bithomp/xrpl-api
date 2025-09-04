import { getOfferCreateFlagsKeys, OfferCreateFlagsKeysInterface } from "../../types/offers";
import { parseFlags } from "./flags";

function parseTxOfferCreateFlags(
  value: number,
  options: { excludeFalse?: boolean; nativeCurrency?: string } = {}
): OfferCreateFlagsKeysInterface {
  return parseFlags(value, getOfferCreateFlagsKeys(options.nativeCurrency), options);
}

export default parseTxOfferCreateFlags;
