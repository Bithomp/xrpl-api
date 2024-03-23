import { AMMWithdrawFlagsKeys, AMMDepositFlagsKeysInterface } from "../../types/amm";
import { parseFlags } from "./flags";

function parseAmmWithdrawFlags(value: number, options: { excludeFalse?: boolean } = {}): AMMDepositFlagsKeysInterface {
  return parseFlags(value, AMMWithdrawFlagsKeys, options);
}

export default parseAmmWithdrawFlags;
