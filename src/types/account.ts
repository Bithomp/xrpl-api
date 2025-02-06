import { FormattedBaseSpecification } from "./specification";
import { IssuedCurrencyAmount, FormattedIssuedCurrencyAmount, FormattedIssuedMPTAmount } from "./amounts";

export type FormattedAccountDeleteSpecification = {
  source?: FormattedSourceAddress;
  destination?: FormattedDestinationAddress;
} & FormattedBaseSpecification;

export type FormattedSourceAddress = {
  address: string;
  maxAmount?: IssuedCurrencyAmount | FormattedIssuedCurrencyAmount | FormattedIssuedMPTAmount;
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
