import { getAMMClawbackFlagsKeys, AMMClawbackFlagsKeysInterface } from "../../types/amm";
import { parseFlags } from "./flags";

function parseTxAmmClawbackFlags(
  value: number,
  options: { excludeFalse?: boolean; nativeCurrency?: string } = {}
): AMMClawbackFlagsKeysInterface {
  return parseFlags(value, getAMMClawbackFlagsKeys(options.nativeCurrency), options);
}

export default parseTxAmmClawbackFlags;
