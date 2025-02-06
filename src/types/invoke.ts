import { FormattedBaseSpecification } from "./specification";
import { FormattedDestinationAddress } from "./account";

export type FormattedInvokeSpecification = {
  destination?: FormattedDestinationAddress;
} & FormattedBaseSpecification;
