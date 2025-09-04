import { NFTokenMintFlags, NFTokenCreateOfferFlags } from "xrpl";
import { FormattedBaseSpecification } from "./specification";
import { Amount } from "./amounts";
import { FormattedSourceAddress, FormattedDestinationAddress } from "./account";
import { TxGlobalFlagsKeysInterface, getTxGlobalFlagsKeys } from "./global";
import { MAINNET_NATIVE_CURRENCY } from "../common";

export const NFTokenFlagsKeys = {
  burnable: NFTokenMintFlags.tfBurnable,
  onlyXRP: NFTokenMintFlags.tfOnlyXRP,
  trustLine: NFTokenMintFlags.tfTrustLine,
  transferable: NFTokenMintFlags.tfTransferable,
  mutable: NFTokenMintFlags.tfMutable,
};

const nativeCurrencyNFTokenMintFlags = {};

export function getNFTokenMintFlagsKeys(nativeCurrency?: string): Record<string, number> {
  if (!nativeCurrency) {
    nativeCurrency = MAINNET_NATIVE_CURRENCY; // eslint-disable-line no-param-reassign
  }

  if (!nativeCurrencyNFTokenMintFlags[nativeCurrency]) {
    nativeCurrencyNFTokenMintFlags[nativeCurrency] = {
      ...getTxGlobalFlagsKeys(nativeCurrency),
      ...NFTokenFlagsKeys,
    };
  }

  return nativeCurrencyNFTokenMintFlags[nativeCurrency];
}

export interface NFTokenFlagsKeysInterface extends TxGlobalFlagsKeysInterface {
  burnable?: boolean;
  onlyXRP?: boolean;
  trustLine?: boolean;
  transferable?: boolean;
  mutable?: boolean;
}

export const NFTokenOfferFlagsKeys = {
  sellToken: NFTokenCreateOfferFlags.tfSellNFToken,
};

const nativeCurrencyNFTokenOfferCreateFlags = {};

export function getNFTokenOfferCreateFlagsKeys(nativeCurrency?: string): Record<string, number> {
  if (!nativeCurrency) {
    nativeCurrency = MAINNET_NATIVE_CURRENCY; // eslint-disable-line no-param-reassign
  }

  if (!nativeCurrencyNFTokenOfferCreateFlags[nativeCurrency]) {
    nativeCurrencyNFTokenOfferCreateFlags[nativeCurrency] = {
      ...getTxGlobalFlagsKeys(nativeCurrency),
      ...NFTokenOfferFlagsKeys,
    };
  }

  return nativeCurrencyNFTokenOfferCreateFlags[nativeCurrency];
}

export interface NFTokenOfferFlagsKeysInterface extends TxGlobalFlagsKeysInterface {
  sellToken?: boolean;
}

export type FormattedNFTokenBurnSpecification = {
  nftokenID: string;
} & FormattedBaseSpecification;

export type FormattedNFTokenMintSpecification = {
  nftokenTaxon: number;
  issuer?: string;
  transferFee?: number;
  uri?: string | null;
  flags?: NFTokenFlagsKeysInterface;
  amount?: Amount;
  destination?: FormattedDestinationAddress;
  expiration?: number;
} & FormattedBaseSpecification;

export type FormattedNFTokenModifySpecification = {
  nftokenID: string;
  owner?: string;
  uri?: string | null;
} & FormattedBaseSpecification;

export type FormattedNFTokenCancelOfferSpecification = {
  nftokenOffers: string[];
} & FormattedBaseSpecification;

export type FormattedNFTokenCreateOfferSpecification = {
  nftokenID: string;
  amount: Amount;
  owner?: string;
  source?: FormattedSourceAddress;
  destination?: FormattedDestinationAddress;
  expiration?: number;
  flags?: NFTokenOfferFlagsKeysInterface;
} & FormattedBaseSpecification;

export type FormattedNFTokenAcceptOfferSpecification = {
  nftokenSellOffer?: string;
  nftokenBuyOffer?: string;
  nftokenBrokerFee?: Amount;
} & FormattedBaseSpecification;
