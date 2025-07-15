import { FormattedBaseSpecification } from "./specification";

export type FormattedDelegateSetSpecification = {
  authorize?: string; // account (address)
  permissions?: string[]; // array of permission names
} & FormattedBaseSpecification;
