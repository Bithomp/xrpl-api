import { FormattedBaseSpecification } from "./specification";
import { FormattedIssuedCurrencyAmount } from "../../../../types";

export type SourcePaymentAddress = {
  address: string;
  maxAmount?: FormattedIssuedCurrencyAmount;
  tag?: number;
};

export type DestinationPaymentAddress = {
  address: string;
  tag?: number;
};

export type FormattedPaymentSpecification = {
  source: SourcePaymentAddress;
  destination: DestinationPaymentAddress;
  invoiceID?: string;
  paths?: string;
  allowPartialPayment?: boolean;
  noDirectRipple?: boolean;
  limitQuality?: boolean;
} & FormattedBaseSpecification;
