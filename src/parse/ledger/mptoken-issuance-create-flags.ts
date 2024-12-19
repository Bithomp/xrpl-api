import { MPTokenIssuanceCreateFlagsKeys, MPTokenIssuanceCreateFlagsKeysInterface } from "../../types/mptokens";
import { parseFlags } from "./flags";

function parseMPTokenIssuanceCreateFlags(value: number, options: { excludeFalse?: boolean } = {}): MPTokenIssuanceCreateFlagsKeysInterface {
  return parseFlags(value, MPTokenIssuanceCreateFlagsKeys, options);
}
export default parseMPTokenIssuanceCreateFlags;
