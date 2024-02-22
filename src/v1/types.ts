import { Amount, Memo } from "../types";

export type TransactionJSON = {
  Account: string;
  TransactionType: string;
  Memos?: Memo[];
  Flags?: number;
  Fulfillment?: string;
  [Field: string]: string | number | any[] | Amount | undefined;
};
