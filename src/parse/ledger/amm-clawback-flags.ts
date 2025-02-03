import { AMMClawbackFlagsKeys, AMMClawbackFlagsKeysInterface } from "../../types/amm";
import { parseFlags } from "./flags";

function parseAmmClawbackFlags(value: number, options: { excludeFalse?: boolean } = {}): AMMClawbackFlagsKeysInterface {
  return parseFlags(value, AMMClawbackFlagsKeys, options);
}

export default parseAmmClawbackFlags;
