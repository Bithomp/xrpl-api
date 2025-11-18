import { CronSetFlagsKeys, CronSetFlagsKeysInterface } from "../../types/cron";
import { parseFlags } from "./flags";

function parseTxCronSetFlags(
  value: number,
  options: { excludeFalse?: boolean; nativeCurrency?: string } = {}
): CronSetFlagsKeysInterface {
  return parseFlags(value, CronSetFlagsKeys, options);
}
export default parseTxCronSetFlags;
