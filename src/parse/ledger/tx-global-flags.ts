import { TxGlobalFlagsKeysInterface, getTxGlobalFlagsKeys } from "../../types/global";
import { parseFlags } from "./flags";

export function parseTxGlobalFlags(
  value: number,
  options: { excludeFalse?: boolean; nativeCurrency?: string } = {}
): TxGlobalFlagsKeysInterface {
  return parseFlags(value, getTxGlobalFlagsKeys(options.nativeCurrency), options);
}
