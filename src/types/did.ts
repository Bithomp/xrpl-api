import { FormattedBaseSpecification } from "./specification";

export type FormattedDIDSetSpecification = {
  uri?: string;
  data?: string;
  didDocument?: string;
} & FormattedBaseSpecification;

export type FormattedDIDDeleteSpecification = {} & FormattedBaseSpecification;
