import { SetRemarksFlags } from "../models/transactions/SetRemarks";
import { FormattedBaseSpecification } from "./specification";

export const RemarksFlagsKeys = {
  immutable: SetRemarksFlags.tfImmutable,
};

export interface RemarksFlagsKeysInterface {
  immutable?: boolean;
}

export type Remark = {
  Remark: {
    RemarkName?: string;
    RemarkValue?: string;
    Flags?: number;
  };
};

export type FormattedRemark = {
  name?: string;
  value?: string;
  flags?: RemarksFlagsKeysInterface;
};

export type FormattedSetRemarksSpecification = {
  ObjectID?: string;
  Remarks?: FormattedRemark[];
} & FormattedBaseSpecification;
