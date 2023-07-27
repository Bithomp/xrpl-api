import { NFTokenMintFlags, NFTokenCreateOfferFlags } from "xrpl";
import { FormattedBaseSpecification } from "./specification";
import { DestinationPaymentAddress } from "./account";

export const NFTokenFlagsKeys = {
  burnable: NFTokenMintFlags.tfBurnable,
  onlyXRP: NFTokenMintFlags.tfOnlyXRP,
  trustLine: NFTokenMintFlags.tfTrustLine,
  transferable: NFTokenMintFlags.tfTransferable,
  // reservedFlag: NFTokenMintFlags.tfReservedFlag,
};

export interface NFTokenFlagsKeysInterface {
  burnable?: boolean;
  onlyXRP?: boolean;
  trustLine?: boolean;
  transferable?: boolean;
  // reservedFlag?: boolean
}

export const NFTokenOfferFlagsKeys = {
  sellToken: NFTokenCreateOfferFlags.tfSellNFToken,
};

export interface NFTokenOfferFlagsKeysInterface {
  sellToken?: boolean;
}

export type FormattedNFTokenBurnSpecification = {
  nftokenID: string;
} & FormattedBaseSpecification;

export type FormattedNFTokenMintSpecification = {
  nftokenTaxon: number;
  issuer?: string;
  transferFee?: number;
  uri?: string;
  flags?: NFTokenFlagsKeysInterface;
} & FormattedBaseSpecification;

export type FormattedNFTokenCancelOfferSpecification = {
  nftokenOffers: string[];
} & FormattedBaseSpecification;

export type FormattedNFTokenCreateOfferSpecification = {
  nftokenID: string;
  amount: string;
  owner?: string;
  destination?: DestinationPaymentAddress;
  expiration?: number;
  flags?: NFTokenOfferFlagsKeysInterface;
} & FormattedBaseSpecification;

export type FormattedNFTokenAcceptOfferSpecification = {
  nftokenSellOffer?: string;
  nftokenBuyOffer?: string;
  nftokenBrokerFee?: string;
} & FormattedBaseSpecification;
