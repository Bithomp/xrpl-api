import { getMPTokenAuthorizeFlagsKeys, MPTokenAuthorizeFlagsKeysInterface } from "../../types/mptokens";
import { parseFlags } from "./flags";

function parseTxMPTokenAuthorizeFlags(
  value: number,
  options: { excludeFalse?: boolean; nativeCurrency?: string } = {}
): MPTokenAuthorizeFlagsKeysInterface {
  return parseFlags(value, getMPTokenAuthorizeFlagsKeys(options.nativeCurrency), options);
}
export default parseTxMPTokenAuthorizeFlags;
