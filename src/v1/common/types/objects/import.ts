import { FormattedBaseSpecification } from "./specification";
import { FormattedSourceAddress } from "./account";

export type FormattedImportBlobSpecification = {
  ledger: number;
  validation: {
    data: any;
    unl: any;
  };
  transaction: {
    tx: any;
    meta: any;
    proof: any;
  };
};

export type FormattedImportSpecification = {
  source: FormattedSourceAddress;
  blob: FormattedImportBlobSpecification | string;
} & FormattedBaseSpecification;
