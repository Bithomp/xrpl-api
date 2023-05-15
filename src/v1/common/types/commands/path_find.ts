import { Amount } from "../objects";

export type PathFindRequest = {
  command: string;
  source_account: string;
  destination_amount: Amount;
  destination_account: string;
  source_currencies?: { currency: string; issuer?: string }[];
  send_max?: Amount;
};

export type RippledPathsResponse = {
  // tslint:disable-next-line:array-type
  alternatives: Array<{
    // tslint:disable-next-line:array-type
    paths_computed: Array<
      // tslint:disable-next-line:array-type
      Array<{
        type: number;
        type_hex: string;
        account?: string;
        issuer?: string;
        currency?: string;
      }>
    >;
    source_amount: Amount;
  }>;
  type: string;
  destination_account: string;
  destination_amount: Amount;
  // tslint:disable-next-line:array-type
  destination_currencies?: Array<string>;
  source_account: string;
  // tslint:disable-next-line:array-type
  source_currencies?: Array<{ currency: string }>;
  full_reply?: boolean;
};
