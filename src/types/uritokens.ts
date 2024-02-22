import { URITokenMintFlags } from "../models/transactions/URITokenMint";
import { FormattedBaseSpecification } from "./specification";
import { Amount } from "./amounts";
import { FormattedSourceAddress, FormattedDestinationAddress } from "./account";

export const URITokenFlagsKeys = {
  burnable: URITokenMintFlags.tfBurnable,
};

export interface URITokenFlagsKeysInterface {
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
