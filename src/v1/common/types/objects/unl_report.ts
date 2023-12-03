import { FormattedBaseSpecification } from "./specification";
import { FormattedSourceAddress } from "./account";

export type FormattedUNLReportSpecification = {
  source: FormattedSourceAddress;
  activeValidator?: string;
  importVLKey?: string;
} & FormattedBaseSpecification;
