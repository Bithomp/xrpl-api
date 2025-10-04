import { MPTokenFlagsKeys, MPTokenFlagsKeysInterface } from "../../types/mptokens";
import { parseFlags } from "./flags";

function parseMPTokenFlags(
  value: number,
  options: { excludeFalse?: boolean; nativeCurrency?: string } = {}
): MPTokenFlagsKeysInterface {
  return parseFlags(value, MPTokenFlagsKeys, options);
}
export default parseMPTokenFlags;
