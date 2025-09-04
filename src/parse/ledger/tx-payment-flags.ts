import { getPaymentFlagsKeys, PaymentKeysInterface } from "../../types/payments";
import { parseFlags } from "./flags";

function parseTxPaymentFlags(
  value: number,
  options: { excludeFalse?: boolean; nativeCurrency?: string } = {}
): PaymentKeysInterface {
  return parseFlags(value, getPaymentFlagsKeys(options.nativeCurrency), options);
}
export default parseTxPaymentFlags;
