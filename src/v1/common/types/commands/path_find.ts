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
  alternatives: {
    paths_computed: {
      type: number;
      type_hex: string;
      account?: string;
      issuer?: string;
      currency?: string;
    }[][];
    source_amount: Amount;
  }[];
  type: string;
  destination_account: string;
  destination_amount: Amount;
  destination_currencies?: string[];
  source_account: string;
  source_currencies?: { currency: string }[];
  full_reply?: boolean;
};
