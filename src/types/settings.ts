import { FormattedBaseSpecification } from "./specification";
import { FormattedTransactionSigner } from "./signers";

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
  signers?: FormattedTransactionSigner[] | null;
  transferRate?: number | null;
  tickSize?: number;
  nftokenMinter?: string;
  walletLocator?: string | null;
} & FormattedBaseSpecification;
