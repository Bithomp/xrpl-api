import { FormattedBaseSpecification } from "./specification";

export type FormattedUNLModifySpecification = {
  nUNL?: boolean;
  PublicKey?: string;
  publicKey?: string;
} & FormattedBaseSpecification;
