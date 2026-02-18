import { LedgerEntry, OfferCreateFlags } from "xrpl";
const { OfferFlags } = LedgerEntry;
import { FormattedBaseSpecification } from "./specification";
import { IssuedCurrencyAmount } from "./amounts";
import { getTxGlobalFlagsKeys, TxGlobalFlagsKeysInterface } from "./global";
import { MAINNET_NATIVE_CURRENCY } from "../common";

export const OfferCreateFlagsKeys = {
  passive: OfferCreateFlags.tfPassive,
  immediateOrCancel: OfferCreateFlags.tfImmediateOrCancel,
  fillOrKill: OfferCreateFlags.tfFillOrKill,
  sell: OfferCreateFlags.tfSell,
  hybrid: OfferCreateFlags.tfHybrid,
};

const nativeCurrencyOfferCreateFlags = {};

export function getOfferCreateFlagsKeys(nativeCurrency?: string): Record<string, number> {
  if (!nativeCurrency) {
    nativeCurrency = MAINNET_NATIVE_CURRENCY; // eslint-disable-line no-param-reassign
  }

  if (!nativeCurrencyOfferCreateFlags[nativeCurrency]) {
    nativeCurrencyOfferCreateFlags[nativeCurrency] = {
      ...getTxGlobalFlagsKeys(nativeCurrency),
      ...OfferCreateFlagsKeys,
    };
  }

  return nativeCurrencyOfferCreateFlags[nativeCurrency];
}

export interface OfferCreateFlagsKeysInterface extends TxGlobalFlagsKeysInterface {
  passive: boolean;
  immediateOrCancel: boolean;
  fillOrKill: boolean;
  sell: boolean;
  hybrid: boolean;
}

export const OfferFlagsKeys = {
  passive: OfferFlags.lsfPassive,
  sell: OfferFlags.lsfSell,
  hybrid: OfferFlags.lsfHybrid,
};

export interface OfferFlagsKeysInterface {
  passive: boolean;
  sell: boolean;
  hybrid: boolean;
}

export type FormattedOfferCancelSpecification = {
  orderSequence: number;
} & FormattedBaseSpecification;

export type FormattedOfferCreateSpecification = {
  flags: OfferCreateFlagsKeysInterface;
  takerGets: IssuedCurrencyAmount;
  takerPays: IssuedCurrencyAmount;
  expirationTime?: string;
  orderToReplace?: number;
  domainID?: string;

  direction: string; // @deprecated, use flags.sell instead
  immediateOrCancel?: boolean; // @deprecated, use flags.immediateOrCancel instead
  fillOrKill?: boolean; // @deprecated, use flags.fillOrKill instead
  passive?: boolean; // @deprecated, use flags.passive instead
  quantity: IssuedCurrencyAmount; // @deprecated, use takerGets instead
  totalPrice: IssuedCurrencyAmount; // @deprecated, use takerPays instead
} & FormattedBaseSpecification;
