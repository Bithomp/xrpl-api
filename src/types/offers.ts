import { LedgerEntry } from "xrpl";
const { OfferFlags } = LedgerEntry;
import { FormattedBaseSpecification } from "./specification";
import { FormattedIssuedCurrencyAmount } from "./amounts";

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
  direction: string;
  quantity: FormattedIssuedCurrencyAmount;
  totalPrice: FormattedIssuedCurrencyAmount;
  immediateOrCancel?: boolean;
  fillOrKill?: boolean;
  expirationTime?: string;
  orderToReplace?: number;
  // If enabled, the offer will not consume offers that exactly match it, and
  // instead becomes an Offer node in the ledger. It will still consume offers
  // that cross it.
  passive?: boolean;
} & FormattedBaseSpecification;
