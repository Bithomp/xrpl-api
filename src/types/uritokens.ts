import { URITokenMintFlags } from "../models/transactions/URITokenMint";
import { FormattedBaseSpecification } from "./specification";
import { Amount } from "./amounts";
import { FormattedSourceAddress, FormattedDestinationAddress } from "./account";
import { TxGlobalFlagsKeysInterface, getTxGlobalFlagsKeys } from "./global";
import { MAINNET_NATIVE_CURRENCY } from "../common";

export const URITokenFlagsKeys = {
  burnable: URITokenMintFlags.tfBurnable,
};

const nativeCurrencyURITokenMintFlags = {};

export function getURITokenMintFlagsKeys(nativeCurrency?: string): Record<string, number> {
  if (!nativeCurrency) {
    nativeCurrency = MAINNET_NATIVE_CURRENCY; // eslint-disable-line no-param-reassign
  }

  if (!nativeCurrencyURITokenMintFlags[nativeCurrency]) {
    nativeCurrencyURITokenMintFlags[nativeCurrency] = {
      ...getTxGlobalFlagsKeys(nativeCurrency),
      ...URITokenFlagsKeys,
    };
  }

  return nativeCurrencyURITokenMintFlags[nativeCurrency];
}

export interface URITokenFlagsKeysInterface extends TxGlobalFlagsKeysInterface {
  burnable?: boolean;
}

export type FormattedURITokenBurnSpecification = {
  uritokenID: string;
} & FormattedBaseSpecification;

export type FormattedURITokenBuySpecification = {
  uritokenID: string;
  amount: string;
} & FormattedBaseSpecification;

export type FormattedURITokenMintSpecification = {
  uri?: string;
  flags?: URITokenFlagsKeysInterface;
  digest?: string;
  amount: Amount;
  source?: FormattedSourceAddress;
  destination?: FormattedDestinationAddress;
} & FormattedBaseSpecification;

export type FormattedURITokenCancelSellOfferSpecification = {
  uritokenID: string;
} & FormattedBaseSpecification;

export type FormattedURITokenCreateSellOfferSpecification = {
  uritokenID: string;
  amount: string;
  source?: FormattedSourceAddress;
  destination?: FormattedDestinationAddress;
} & FormattedBaseSpecification;

export type FormattedURITokenAcceptOfferSpecification = {
  nftokenSellOffer?: string;
  nftokenBuyOffer?: string;
  nftokenBrokerFee?: string;
} & FormattedBaseSpecification;
