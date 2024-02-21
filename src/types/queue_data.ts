export interface QueueTransaction {
  /**
   * Whether this transaction changes this address's ways of authorizing
   * transactions.
   */
  auth_change: boolean;
  /** The Transaction Cost of this transaction, in drops of XRP. */
  fee: string;
  /**
   * The transaction cost of this transaction, relative to the minimum cost for
   * this type of transaction, in fee levels.
   */
  fee_level: string;
  /** The maximum amount of XRP, in drops, this transaction could send or destroy. */
  max_spend_drops: string;
  /** The Sequence Number of this transaction. */
  seq: number;
}

export interface QueueData {
  /** Number of queued transactions from this address. */
  txn_count: number;
  /**
   * Whether a transaction in the queue changes this address's ways of
   * authorizing transactions. If true, this address can queue no further
   * transactions until that transaction has been executed or dropped from the
   * queue.
   */
  auth_change_queued?: boolean;
  /** The lowest Sequence Number among transactions queued by this address. */
  lowest_sequence?: number;
  /** The highest Sequence Number among transactions queued by this address. */
  highest_sequence?: number;
  /**
   * Integer amount of drops of XRP that could be debited from this address if
   * every transaction in the queue consumes the maximum amount of XRP possible.
   */
  max_spend_drops_total?: string;
  /** Information about each queued transaction from this address. */
  transactions?: QueueTransaction[];
}
