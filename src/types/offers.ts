import { LedgerEntry, OfferCreateFlags } from "xrpl";
const { OfferFlags } = LedgerEntry;
import { FormattedBaseSpecification } from "./specification";
import { FormattedIssuedCurrencyAmount } from "./amounts";

export const OfferCreateFlagsKeys = {
  passive: OfferCreateFlags.tfPassive,
  immediateOrCancel: OfferCreateFlags.tfImmediateOrCancel,
  fillOrKill: OfferCreateFlags.tfFillOrKill,
  sell: OfferCreateFlags.tfSell,
};

export interface OfferCreateFlagsKeysInterface {
  passive: boolean;
  immediateOrCancel: boolean;
  fillOrKill: boolean;
  sell: boolean;
}

export const OfferFlagsKeys = {
  passive: OfferFlags.lsfPassive,
  sell: OfferFlags.lsfSell,
};

export interface OfferFlagsKeysInterface {
  passive: boolean;
  sell: boolean;
}

export type FormattedOfferCancelSpecification = {
  orderSequence: number;
} & FormattedBaseSpecification;

export type FormattedOfferCreateSpecification = {
  flags: OfferCreateFlagsKeysInterface;
  quantity: FormattedIssuedCurrencyAmount;
  totalPrice: FormattedIssuedCurrencyAmount;
  expirationTime?: string;
  orderToReplace?: number;

  direction: string; // @deprecated, use flags.sell instead
  immediateOrCancel?: boolean; // @deprecated, use flags.immediateOrCancel instead
  fillOrKill?: boolean; // @deprecated, use flags.fillOrKill instead

  // If enabled, the offer will not consume offers that exactly match it, and
  // instead becomes an Offer node in the ledger. It will still consume offers
  // that cross it.
  passive?: boolean; // @deprecated, use flags.passive instead
} & FormattedBaseSpecification;
