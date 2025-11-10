import { FormattedBaseSpecification } from "./specification";

export type FormattedFeeUpdateSpecification = {
  baseFeeNativeCurrency: string;
  reserveBaseNativeCurrency: string;
  reserveIncrementNativeCurrency: string;

  baseFeeXRP: string; // @deprecated use baseFeeNativeCurrency
  reserveBaseXRP: string; // @deprecated use reserveBaseNativeCurrency
  reserveIncrementXRP: string; // @deprecated use reserveIncrementNativeCurrency
} & FormattedBaseSpecification;
