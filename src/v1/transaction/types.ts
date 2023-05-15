import { RippledAmount, Memo } from "../common/types/objects";

export type TransactionJSON = {
  Account: string;
  TransactionType: string;
  Memos?: Memo[];
  Flags?: number;
  Fulfillment?: string;
  [Field: string]: string | number | any[] | RippledAmount | undefined;
};

export type Outcome = {
  result?: string;
  ledgerVersion?: number;
  indexInLedger?: number;
  fee?: string;
  balanceChanges?: {
    [key: string]: {
      currency: string;
      counterparty?: string;
      value: string;
    }[];
  };
  lockedBalanceChanges?: {
    [key: string]: {
      currency: string;
      counterparty?: string;
      value: string;
    }[];
  };
  orderbookChanges?: object;
  channelChanges?: object;
  nftokenChanges?: object;
  nftokenOfferChanges?: object;
  affectedObjects?: object;
  deliveredAmount?: {
    currency: string;
    counterparty?: string;
    value: string;
  };
  timestamp?: string;
};
