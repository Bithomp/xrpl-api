import { XAHAU_NATIVE_CURRENCY } from "../common";

export enum GlobalFlags {
  tfFullyCanonicalSig = 0x80000000,

  // XRPL specific
  tfInnerBatchTxn = 0x40000000,
}

export interface TxGlobalFlagsKeysInterface {
  fullyCanonicalSig?: boolean;

  // XRPL specific
  innerBatchTxn?: boolean;
}

export const TxGlobalFlagsKeys = {
  fullyCanonicalSig: GlobalFlags.tfFullyCanonicalSig,
};

// XRPL specific (default)
export const XRPLTxGlobalFlagsKeys = {
  ...TxGlobalFlagsKeys,

  innerBatchTxn: GlobalFlags.tfInnerBatchTxn,
};

// Xahau specific
export const XahauTxGlobalFlagsKeys = {
  ...TxGlobalFlagsKeys,
};

export function getTxGlobalFlagsKeys(nativeCurrency?: string): Record<string, number> {
  // const nativeCurrency = getNativeCurrency();
  if (nativeCurrency === XAHAU_NATIVE_CURRENCY) {
    // Xahau specific
    return XahauTxGlobalFlagsKeys;
  } else {
    // XRPL specific (default)
    return XRPLTxGlobalFlagsKeys;
  }
}
