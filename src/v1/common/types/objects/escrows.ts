import { FormattedBaseSpecification } from "./specification";
import { Amount } from "../../../../types";
import { FormattedSourceAddress, FormattedDestinationAddress } from "./account";

export type FormattedEscrowCancelSpecification = {
  owner: string;
  escrowSequence: number;
} & FormattedBaseSpecification;

export type FormattedEscrowCreateSpecification = {
  amount?: Amount;
  source: FormattedSourceAddress;
  destination: FormattedDestinationAddress;
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
