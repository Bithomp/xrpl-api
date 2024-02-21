import { FormattedBaseSpecification } from "./specification";
import { FormattedIssuedCurrencyAmount } from "..";

export type FormattedAccountDeleteSpecification = {
  source?: FormattedSourceAddress;
  destination?: FormattedDestinationAddress;
} & FormattedBaseSpecification;

export type FormattedSourceAddress = {
  address: string;
  maxAmount?: FormattedIssuedCurrencyAmount;
  tag?: number;
};

export type FormattedDestinationAddress = {
  address: string;
  tag?: number;
};
