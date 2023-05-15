import { FormattedBaseSpecification } from "./specification";

export type FormattedFeeUpdateSpecification = {
  baseFeeXRP: string;
  referenceFeeUnits: number;
  reserveBaseXRP: string;
  reserveIncrementXRP: string;
} & FormattedBaseSpecification;
