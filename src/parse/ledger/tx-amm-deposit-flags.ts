import { getAMMDepositFlagsKeys, AMMDepositFlagsKeysInterface } from "../../types/amm";
import { parseFlags } from "./flags";

function parseTxAmmDepositFlags(
  value: number,
  options: { excludeFalse?: boolean; nativeCurrency?: string } = {}
): AMMDepositFlagsKeysInterface {
  return parseFlags(value, getAMMDepositFlagsKeys(options.nativeCurrency), options);
}

export default parseTxAmmDepositFlags;
