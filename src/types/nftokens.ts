import { NFTokenMintFlags, NFTokenCreateOfferFlags } from "xrpl";
import { FormattedBaseSpecification } from "./specification";
import { Amount } from "./amounts";
import { FormattedSourceAddress, FormattedDestinationAddress } from "./account";

export const NFTokenFlagsKeys = {
  burnable: NFTokenMintFlags.tfBurnable,
  onlyXRP: NFTokenMintFlags.tfOnlyXRP,
  trustLine: NFTokenMintFlags.tfTrustLine,
  transferable: NFTokenMintFlags.tfTransferable,
  mutable: NFTokenMintFlags.tfMutable,
};

export interface NFTokenFlagsKeysInterface {
  burnable?: boolean;
  onlyXRP?: boolean;
  trustLine?: boolean;
  transferable?: boolean;
  mutable?: boolean;
}

export const NFTokenOfferFlagsKeys = {
  sellToken: NFTokenCreateOfferFlags.tfSellNFToken,
};

export interface NFTokenOfferFlagsKeysInterface {
  sellToken?: boolean;
}

export type FormattedNFTokenBurnSpecification = {
  account: string;
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
