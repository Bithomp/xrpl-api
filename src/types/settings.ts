import { FormattedBaseSpecification } from "./specification";

export type WeightedSigner = {
  address: string;
  weight: number;
};

export type Signers = {
  threshold?: number;
  weights: WeightedSigner[];
};

export type FormattedSettingsSpecification = {
  defaultRipple?: boolean;
  depositAuth?: boolean;
  disableMasterKey?: boolean;
  disallowIncomingXRP?: boolean;
  disallowIncomingNFTokenOffer?: boolean;
  disallowIncomingCheck?: boolean;
  disallowIncomingPayChan?: boolean;
  disallowIncomingTrustline?: boolean;
  domain?: string;
  emailHash?: string | null;
  enableTransactionIDTracking?: boolean;
  globalFreeze?: boolean;
  messageKey?: string;
  noFreeze?: boolean;
  passwordSpent?: boolean;
  regularKey?: string;
  requireAuthorization?: boolean;
  requireDestinationTag?: boolean;
  signers?: Signers;
  transferRate?: number | null;
  tickSize?: number;
  nftokenMinter?: string;
  walletLocator?: string | null;
} & FormattedBaseSpecification;
