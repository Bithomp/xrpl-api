import { getTrustSetFlagsKeys, TrustSetFlagsKeysInterface } from "../../types/trustlines";
import { parseFlags } from "./flags";

function parseTxTrustSetFlags(
  value: number,
  options: { excludeFalse?: boolean; nativeCurrency?: string } = {}
): TrustSetFlagsKeysInterface {
  return parseFlags(value, getTrustSetFlagsKeys(options.nativeCurrency), options);
}
export default parseTxTrustSetFlags;
