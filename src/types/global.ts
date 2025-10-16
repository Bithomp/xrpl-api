import { XAHAU_NATIVE_CURRENCY } from "../common";

export enum GlobalFlags {
  // The tfFullyCanonicalSig flag was used from 2014 until 2020 to protect against transaction malleability while
  // maintaining compatibility with legacy signing software. The RequireFullyCanonicalSig amendment ended compatibility
  // with such legacy software and made the protections the default for all transactions. If you are using a parallel
  // network that does not have RequireFullyCanonicalSig enabled, you should always enable the tfFullyCanonicalSig flag
  // to protect against transaction malleability.

  // DEPRECATED No effect. (If the RequireFullyCanonicalSig amendment is not enabled, this flag enforces a fully-canonical signature.)
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
  // DEPRECATED No effect. (If the RequireFullyCanonicalSig amendment is not enabled, this flag enforces a fully-canonical signature.)
  // fullyCanonicalSig: GlobalFlags.tfFullyCanonicalSig,
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
