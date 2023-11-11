import { AccountOffer } from "xrpl";

export interface AccountOffersRequest {
  account: string;
  ledger_hash?: string;
  ledger_index?: number | ("validated" | "closed" | "current");
  limit?: number;
  marker?: any;
}

export interface AccountOffers {
  /** Unique Address identifying the account that made the offers. */
  account: string;
  /**
   * Array of objects, where each object represents an offer made by this
   * account that is outstanding as of the requested ledger version. If the
   * number of offers is large, only returns up to limit at a time.
   */
  offers?: AccountOffer[];
  /**
   * The ledger index of the current in-progress ledger version, which was
   * used when retrieving this data.
   */
  ledger_current_index?: number;
  /**
   * The ledger index of the ledger version that was used when retrieving
   * this data, as requested.
   */
  ledger_index?: number;
  /**
   * The identifying hash of the ledger version that was used when retrieving
   * this data.
   */
  ledger_hash?: string;
  /**
   * Server-defined value indicating the response is paginated. Pass this to
   * the next call to resume where this call left off. Omitted when there are
   * no pages of information after this one.
   */
  marker?: unknown;
}
