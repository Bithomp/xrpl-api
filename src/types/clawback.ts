import { FormattedBaseSpecification } from "./specification";
import { FormattedAmount } from "./amounts";

export type FormattedClawbackSpecification = {
  amount?: FormattedAmount;
} & FormattedBaseSpecification;
