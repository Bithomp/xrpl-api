import { getBatchFlagsKeys, BatchFlagsKeysInterface } from "../../types/batch";
import { parseFlags } from "./flags";

function parseTxBatchFlags(
  value: number,
  options: { excludeFalse?: boolean; nativeCurrency?: string } = {}
): BatchFlagsKeysInterface {
  return parseFlags(value, getBatchFlagsKeys(options.nativeCurrency), options);
}

export default parseTxBatchFlags;
