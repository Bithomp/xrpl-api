import { NFTokenMintFlags } from "xrpl";
import { FormattedBaseSpecification } from "./specification";

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
