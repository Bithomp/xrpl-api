import { FormattedBaseSpecification } from "./specification";
import { FormattedSourceAddress, FormattedDestinationAddress } from "./account";

export type FormattedInvokeSpecification = {
  source: FormattedSourceAddress;
  destination: FormattedDestinationAddress;
} & FormattedBaseSpecification;
