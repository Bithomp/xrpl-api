import { NFTokenMintFlags, NFTokenCreateOfferFlags } from "xrpl";
import { FormattedBaseSpecification } from "./specification";
import { Amount } from "../../../../types";

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
  account: string;
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
  amount: Amount;
  owner?: string;
  destination?: string;
  expiration?: number;
  flags?: NFTokenOfferFlagsKeysInterface;
} & FormattedBaseSpecification;

export type FormattedNFTokenAcceptOfferSpecification = {
  nftokenSellOffer?: string;
  nftokenBuyOffer?: string;
  nftokenBrokerFee?: string;
} & FormattedBaseSpecification;
