import { FormattedBaseSpecification } from "./specification";
import { FormattedIssuedCurrencyAmount, FormattedIssuedMPTAmount } from "./amounts";

export type FormattedAccountDeleteSpecification = {
  source?: FormattedSourceAddress;
  destination?: FormattedDestinationAddress;
} & FormattedBaseSpecification;

export type FormattedSourceAddress = {
  address: string;
  maxAmount?: FormattedIssuedCurrencyAmount | FormattedIssuedMPTAmount;
  tag?: number;
};

export type FormattedDestinationAddress = {
  address: string;
  tag?: number;
};

export type FormattedAccountInfoData = {
  sequence: number;
  xrpBalance: string;
  ownerCount: number;
  previousInitiatedTransactionID?: string;
  previousAffectingTransactionID: string;
  previousAffectingTransactionLedgerVersion: number;
};
