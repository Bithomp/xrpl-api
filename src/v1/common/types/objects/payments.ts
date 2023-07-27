import { FormattedBaseSpecification } from "./specification";
import { DestinationPaymentAddress } from "./account";

export type FormattedPaymentSpecification = {
  destination: DestinationPaymentAddress;
  invoiceID?: string;
  paths?: string;
  allowPartialPayment?: boolean;
  noDirectRipple?: boolean;
  limitQuality?: boolean;
} & FormattedBaseSpecification;
