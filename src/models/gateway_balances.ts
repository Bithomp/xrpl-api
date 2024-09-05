export interface GatewayBalance {
  currency: string;
  value: string;
}

export interface GatewayBalances {
  /** The address of the account that issued the balances. */
  account: string;
  /**
   * Total amounts issued to addresses not excluded, as a map of currencies
   * to the total value issued.
   */
  obligations?: { [currency: string]: string };
  /**
   * Amounts issued to the hotwallet addresses from the request. The keys are
   * addresses and the values are arrays of currency amounts they hold.
   */
  balances?: { [address: string]: GatewayBalance[] };
  /**
   * Total amounts held that are issued by others. In the recommended
   * configuration, the issuing address should have none.
   */
  assets?: { [address: string]: GatewayBalance[] };
  /**
   * The identifying hash of the ledger version that was used to generate
   * this response.
   */
  ledger_hash?: string;
  /**
   * The ledger index of the ledger version that was used to generate this
   * response.
   */
  ledger_current_index?: number;
  /**
   * The ledger index of the current in-progress ledger version, which was
   * used to retrieve this information.
   */
  ledger_index?: number;
}
