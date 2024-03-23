import { AMMDepositFlagsKeys, AMMDepositFlagsKeysInterface } from "../../types/amm";
import { parseFlags } from "./flags";

function parseAmmDepositFlags(value: number, options: { excludeFalse?: boolean } = {}): AMMDepositFlagsKeysInterface {
  return parseFlags(value, AMMDepositFlagsKeys, options);
}

export default parseAmmDepositFlags;
