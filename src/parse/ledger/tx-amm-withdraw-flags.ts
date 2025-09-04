import { getAMMWithdrawFlagsKeys, AMMDepositFlagsKeysInterface } from "../../types/amm";
import { parseFlags } from "./flags";

function parseTxAmmWithdrawFlags(
  value: number,
  options: { excludeFalse?: boolean; nativeCurrency?: string } = {}
): AMMDepositFlagsKeysInterface {
  return parseFlags(value, getAMMWithdrawFlagsKeys(options.nativeCurrency), options);
}

export default parseTxAmmWithdrawFlags;
