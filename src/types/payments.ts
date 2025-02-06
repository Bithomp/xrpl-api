import { FormattedBaseSpecification } from "./specification";
import { FormattedSourceAddress, FormattedDestinationAddress } from "./account";

export type FormattedPaymentSpecification = {
  source?: FormattedSourceAddress;
  destination?: FormattedDestinationAddress;
  invoiceID?: string;
  paths?: string;
  allowPartialPayment?: boolean;
  noDirectRipple?: boolean;
  limitQuality?: boolean;
} & FormattedBaseSpecification;
