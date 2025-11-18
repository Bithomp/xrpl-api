import { CronSetFlags } from "../models/transactions/CronSet";
import { TxGlobalFlagsKeysInterface } from "./global";
import { FormattedBaseSpecification } from "./specification";

export const CronSetFlagsKeys = {
  cronUnset: CronSetFlags.tfCronUnset,
};

export interface CronSetFlagsKeysInterface extends TxGlobalFlagsKeysInterface {
  cronUnset?: boolean;
}

export type FormattedCronSetSpecification = {
  startTime?: number;
  repeatCount?: number;
  delaySeconds?: number;
} & FormattedBaseSpecification;

export type FormattedCronSpecification = {
  owner?: string;
} & FormattedBaseSpecification;
