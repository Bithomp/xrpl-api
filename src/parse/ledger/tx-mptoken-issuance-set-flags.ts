import { getMPTokenIssuanceSetFlagsKeys, MPTokenIssuanceSetFlagsKeysInterface } from "../../types/mptokens";
import { parseFlags } from "./flags";

function parseTxMPTokenIssuanceSetFlags(
  value: number,
  options: { excludeFalse?: boolean; nativeCurrency?: string } = {}
): MPTokenIssuanceSetFlagsKeysInterface {
  return parseFlags(value, getMPTokenIssuanceSetFlagsKeys(options.nativeCurrency), options);
}
export default parseTxMPTokenIssuanceSetFlags;
