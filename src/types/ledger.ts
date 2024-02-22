export interface Ledger {
  account_hash: string;
  close_time: number;
  close_time_human: string;
  close_time_resolution: number;
  closed: boolean;
  ledger_hash: string;
  ledger_index: string;
  parent_hash: string;
  total_coins: string;
  transaction_hash: string;
  transactions: string[] | object[];
  close_flags?: number;
  parent_close_time?: number;
  accountState?: any[];
  validated?: boolean;
}

export type FormattedLedger = {
  // TODO: properties in type don't match response object. Fix!
  // closed: boolean,
  stateHash: string;
  closeTime: string;
  closeTimeResolution: number;
  closeFlags: number;
  ledgerHash: string;
  ledgerVersion: number;
  parentLedgerHash: string;
  parentCloseTime: string;
  totalDrops: string;
  transactionHash: string;
  transactions?: object[];
  transactionHashes?: string[];
  rawState?: string;
  stateHashes?: string[];
};

// https://xrpl.org/subscribe.html#ledger-stream
export type LedgerClosedEvent = {
  type: "ledgerClosed";
  fee_base: number;
  fee_ref: number;
  ledger_hash: string;
  ledger_index: number;
  ledger_time: number;
  reserve_base: number;
  reserve_inc: number;
  txn_count: number;
  validated_ledgers: string;
};
