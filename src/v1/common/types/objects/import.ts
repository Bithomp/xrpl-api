import { FormattedBaseSpecification } from "./specification";

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
  blob: FormattedImportBlobSpecification | string;
} & FormattedBaseSpecification;
