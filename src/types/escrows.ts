import { FormattedBaseSpecification } from "./specification";
import { Amount } from "./amounts";

export type FormattedEscrowCancelSpecification = {
  owner: string;
  escrowSequence: string | number;
} & FormattedBaseSpecification;

export type FormattedEscrowCreateSpecification = {
  amount?: Amount;
  condition?: string;
  allowCancelAfter?: string;
  allowExecuteAfter?: string;
} & FormattedBaseSpecification;

export type FormattedEscrowFinishSpecification = {
  owner: string;
  escrowSequence: string | number;
  condition?: string;
  fulfillment?: string;
} & FormattedBaseSpecification;
