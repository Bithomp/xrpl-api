import { FormattedBaseSpecification } from "./specification";

export type FormattedUNLReportSpecification = {
  activeValidator?: string;
  importVLKey?: string;
} & FormattedBaseSpecification;
