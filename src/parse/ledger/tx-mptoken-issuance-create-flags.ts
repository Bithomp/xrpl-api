import { getMPTokenIssuanceCreateFlagsKeys, MPTokenIssuanceCreateFlagsKeysInterface } from "../../types/mptokens";
import { parseFlags } from "./flags";

function parseTxMPTokenIssuanceCreateFlags(
  value: number,
  options: { excludeFalse?: boolean, nativeCurrency?: string } = {}
): MPTokenIssuanceCreateFlagsKeysInterface {
  return parseFlags(value, getMPTokenIssuanceCreateFlagsKeys(options.nativeCurrency), options);
}
export default parseTxMPTokenIssuanceCreateFlags;
