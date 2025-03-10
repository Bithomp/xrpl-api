import { TrustlineFlagsKeys, TrustlineFlagsKeysInterface } from "../../types/trustlines";
import { parseFlags } from "./flags";

function parseTrustlineFlags(value: number, options: { excludeFalse?: boolean } = {}): TrustlineFlagsKeysInterface {
  return parseFlags(value, TrustlineFlagsKeys, options);
}

export default parseTrustlineFlags;
