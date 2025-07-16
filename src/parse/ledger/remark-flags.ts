import { RemarksFlagsKeys, RemarksFlagsKeysInterface } from "../../types/remarks";
import { parseFlags } from "./flags";

function parseRemarkFlags(value: number, options: { excludeFalse?: boolean } = {}): RemarksFlagsKeysInterface {
  return parseFlags(value, RemarksFlagsKeys, options);
}

export default parseRemarkFlags;
