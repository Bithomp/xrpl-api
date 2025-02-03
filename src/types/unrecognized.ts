import { FormattedBaseSpecification } from "./specification";

export type FormattedUnrecognizedParserSpecification = {
  UNAVAILABLE: string;
  SEE_RAW_TRANSACTION: string;
} & FormattedBaseSpecification;
