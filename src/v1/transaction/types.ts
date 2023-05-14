import { RippledAmount } from "../common/types/objects";

export type ApiMemo = {
  MemoData?: string;
  MemoType?: string;
  MemoFormat?: string;
};

export type TransactionJSON = {
  Account: string;
  TransactionType: string;
  Memos?: { Memo: ApiMemo }[];
  Flags?: number;
  Fulfillment?: string;
  [Field: string]: string | number | any[] | RippledAmount | undefined;
};

export type Instructions = {
  sequence?: number;
  ticketSequence?: number;
  fee?: string;
  // @deprecated
  maxFee?: string;
  maxLedgerVersion?: number;
  maxLedgerVersionOffset?: number;
  signersCount?: number;
};

export type Prepare = {
  txJSON: string;
  instructions: {
    fee: string;
    sequence?: number;
    ticketSequence?: number;
    maxLedgerVersion?: number;
  };
};

export type Submit = {
  success: boolean;
  engineResult: string;
  engineResultCode: number;
  engineResultMessage?: string;
  txBlob?: string;
  txJson?: object;
};

export interface OfferCreateTransaction extends TransactionJSON {
  TransactionType: "OfferCreate";
  Account: string;
  Fee: string;
  Flags: number;
  LastLedgerSequence: number;
  Sequence: number;
  TakerGets: RippledAmount;
  TakerPays: RippledAmount;
  Expiration?: number;
  OfferSequence?: number;
  Memos?: { Memo: ApiMemo }[];
}

export interface SettingsTransaction extends TransactionJSON {
  TransferRate?: number;
}

export type KeyPair = {
  publicKey: string;
  privateKey: string;
};

export type SignOptions = {
  signAs: string;
};

export type Outcome = {
  result: string;
  ledgerVersion: number;
  indexInLedger: number;
  fee: string;
  balanceChanges: {
    [key: string]: {
      currency: string;
      counterparty?: string;
      value: string;
    }[];
  };
  orderbookChanges: object;
  deliveredAmount?: {
    currency: string;
    counterparty?: string;
    value: string;
  };
  timestamp?: string;
};

export type FormattedOrderCancellation = {
  orderSequence: number;
};
