import { FormattedBaseSpecification } from "./specification";
import { FormattedSpecification } from "../parse/transaction";
import { Outcome } from "./outcome";

export type FormattedImportBlobSpecification = {
  ledger: number;
  validation: {
    data: any;
    unl: any;
  };
  transaction: {
    id: string;
    tx: any;
    meta: any;
    proof: any;
    specification: FormattedSpecification;
    outcome?: Outcome;
  };
};

export type FormattedImportSpecification = {
  blob: FormattedImportBlobSpecification | string;
} & FormattedBaseSpecification;
