import { AccountSetTfFlags } from "xrpl";
import { GlobalFlags } from "../../types/global";
import { MAINNET_NATIVE_CURRENCY } from "../../common";

function parseTxAccountSetFlags(value: number, options: { nativeCurrency?: string } = {}): Record<string, number> {
  const flags = {} as any;

  /* eslint-disable no-bitwise */
  // DEPRECATED No effect. (If the RequireFullyCanonicalSig amendment is not enabled, this flag enforces a fully-canonical signature.)
  // if (value & GlobalFlags.tfFullyCanonicalSig) {
  //   flags.fullyCanonicalSig = true;
  // } else {
  //   flags.fullyCanonicalSig = false;
  // }

  if (options.nativeCurrency === MAINNET_NATIVE_CURRENCY) {
    if (value & GlobalFlags.tfInnerBatchTxn) {
      flags.innerBatchTxn = true;
    } else {
      flags.innerBatchTxn = false;
    }
  }

  if (value & AccountSetTfFlags.tfRequireDestTag) {
    flags.requireDestTag = true;
  } else if (value & AccountSetTfFlags.tfOptionalDestTag) {
    flags.requireDestTag = false;
  }

  if (value & AccountSetTfFlags.tfRequireAuth) {
    flags.requireAuth = true;
  } else if (value & AccountSetTfFlags.tfOptionalAuth) {
    flags.requireAuth = false;
  }

  if (value & AccountSetTfFlags.tfDisallowXRP) {
    flags.disallowXRP = true;
  } else if (value & AccountSetTfFlags.tfAllowXRP) {
    flags.disallowXRP = false;
  }

  /* eslint-enable no-bitwise */

  return flags;
}
export default parseTxAccountSetFlags;
