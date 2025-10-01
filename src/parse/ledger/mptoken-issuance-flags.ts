import { MPTokenIssuanceFlagsKeys, MPTokenIssuanceFlagsKeysInterface } from "../../types/mptokens";
import { parseFlags } from "./flags";

function parseMPTokenIssuanceFlags(
  value: number,
  options: { excludeFalse?: boolean, nativeCurrency?: string } = {}
): MPTokenIssuanceFlagsKeysInterface {
  return parseFlags(value, MPTokenIssuanceFlagsKeys, options);
}
export default parseMPTokenIssuanceFlags;
