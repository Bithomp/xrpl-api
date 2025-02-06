import { FormattedBaseSpecification } from "./specification";
import { Amount } from "./amounts";

export type FormattedEscrowCancelSpecification = {
  owner: string;
  escrowSequence: number;
} & FormattedBaseSpecification;

export type FormattedEscrowCreateSpecification = {
  amount?: Amount;
  condition: string;
  allowCancelAfter?: string;
  allowExecuteAfter?: string;
} & FormattedBaseSpecification;

export type FormattedEscrowFinishSpecification = {
  owner: string;
  escrowSequence: number;
  condition?: string;
  fulfillment?: string;
} & FormattedBaseSpecification;
