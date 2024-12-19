import { MPTokenIssuanceSetFlagsKeys, MPTokenIssuanceSetFlagsKeysInterface } from "../../types/mptokens";
import { parseFlags } from "./flags";

function parseMPTokenIssuanceSetFlags(value: number, options: { excludeFalse?: boolean } = {}): MPTokenIssuanceSetFlagsKeysInterface {
  return parseFlags(value, MPTokenIssuanceSetFlagsKeys, options);
}
export default parseMPTokenIssuanceSetFlags;
