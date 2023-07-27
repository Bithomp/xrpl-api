import { FormattedBaseSpecification } from "./specification";
import { FormattedAmount } from "../../../../types";
import { DestinationPaymentAddress } from "./account";

export type FormattedEscrowCancelSpecification = {
  owner: string;
  escrowSequence: number;
} & FormattedBaseSpecification;

export type FormattedEscrowCreateSpecification = {
  destination: DestinationPaymentAddress;
  amount?: FormattedAmount;
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
