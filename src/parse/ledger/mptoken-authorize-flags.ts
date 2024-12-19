import { MPTokenAuthorizeFlagsKeys, MPTokenAuthorizeFlagsKeysInterface } from "../../types/mptokens";
import { parseFlags } from "./flags";

function parseMPTokenAuthorizeFlags(
  value: number,
  options: { excludeFalse?: boolean } = {}
): MPTokenAuthorizeFlagsKeysInterface {
  return parseFlags(value, MPTokenAuthorizeFlagsKeys, options);
}
export default parseMPTokenAuthorizeFlags;
