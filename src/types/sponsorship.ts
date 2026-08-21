import { FormattedBaseSpecification } from "./specification";
import { FormattedAmount } from "./amounts";
import { FormattedDestinationAddress } from "./account";
import { getTxGlobalFlagsKeys, TxGlobalFlagsKeysInterface } from "./global";
import { MAINNET_NATIVE_CURRENCY } from "../common";

export enum SponsorshipSetFlags {
  tfSponsorshipSetRequireSignForFee = 0x00010000,
  tfSponsorshipClearRequireSignForFee = 0x00020000,
  tfSponsorshipSetRequireSignForReserve = 0x00040000,
  tfSponsorshipClearRequireSignForReserve = 0x00080000,
  tfDeleteObject = 0x00100000,
}

export const SponsorshipSetFlagsKeys = {
  setRequireSignForFee: SponsorshipSetFlags.tfSponsorshipSetRequireSignForFee,
  clearRequireSignForFee: SponsorshipSetFlags.tfSponsorshipClearRequireSignForFee,
  setRequireSignForReserve: SponsorshipSetFlags.tfSponsorshipSetRequireSignForReserve,
  clearRequireSignForReserve: SponsorshipSetFlags.tfSponsorshipClearRequireSignForReserve,
  deleteObject: SponsorshipSetFlags.tfDeleteObject,
};

const nativeCurrencySponsorshipSetFlags = {};

export function getSponsorshipSetFlagsKeys(nativeCurrency?: string): Record<string, number> {
  if (!nativeCurrency) {
    nativeCurrency = MAINNET_NATIVE_CURRENCY; // eslint-disable-line no-param-reassign
  }

  if (!nativeCurrencySponsorshipSetFlags[nativeCurrency]) {
    nativeCurrencySponsorshipSetFlags[nativeCurrency] = {
      ...getTxGlobalFlagsKeys(nativeCurrency),
      ...SponsorshipSetFlagsKeys,
    };
  }

  return nativeCurrencySponsorshipSetFlags[nativeCurrency];
}

export interface SponsorshipSetFlagsKeysInterface extends TxGlobalFlagsKeysInterface {
  setRequireSignForFee: boolean;
  clearRequireSignForFee: boolean;
  setRequireSignForReserve: boolean;
  clearRequireSignForReserve: boolean;
  deleteObject: boolean;
}

export type FormattedSponsorshipSetSpecification = {
  CounterpartySponsor?: FormattedDestinationAddress;
  feeAmountDelta?: FormattedAmount;
  maxFee?: FormattedAmount;
  remainingOwnerCountDelta?: number;
  Sponsee?: FormattedDestinationAddress;
  flags: SponsorshipSetFlagsKeysInterface;
} & FormattedBaseSpecification;
