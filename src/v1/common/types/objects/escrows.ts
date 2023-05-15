import { FormattedBaseSpecification } from "./specification";
import { RippledAmount } from "./amounts";

export type FormattedEscrowCancelSpecification = {
  owner: string;
  escrowSequence: number;
} & FormattedBaseSpecification;

export type FormattedEscrowCreateSpecification = {
  amount?: RippledAmount;
  destination: string;
  condition: string;
  allowCancelAfter?: string;
  allowExecuteAfter?: string;
  sourceTag?: number;
  destinationTag?: number;
} & FormattedBaseSpecification;

export type FormattedEscrowFinishSpecification = {
  owner: string;
  escrowSequence: number;
  condition?: string;
  fulfillment?: string;
} & FormattedBaseSpecification;
