import { FormattedBaseSpecification } from "./specification";

export type FormattedDepositPreauthSpecification = {
  // account (address) of the sender to preauthorize
  authorize: string;

  // account (address) of the sender whose preauthorization should be revoked
  unauthorize: string;
} & FormattedBaseSpecification;
