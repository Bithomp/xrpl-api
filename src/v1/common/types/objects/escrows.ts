import { FormattedBaseSpecification } from "./specification";
import { FormattedAmount } from "../../../../types";

export type FormattedEscrowCancelSpecification = {
  owner: string;
  escrowSequence: number;
} & FormattedBaseSpecification;

export type FormattedEscrowCreateSpecification = {
  amount?: FormattedAmount;
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
