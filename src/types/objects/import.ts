import { FormattedBaseSpecification } from "./specification";
import { FormattedSourceAddress } from "./account";
import { FormattedSpecification } from "../../parse/transaction";
import { Outcome } from "../outcome";

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
  source: FormattedSourceAddress;
  blob: FormattedImportBlobSpecification | string;
} & FormattedBaseSpecification;
