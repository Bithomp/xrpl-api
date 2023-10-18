// NOTE: Hooks is not part of mainnet, this code can be changed in the future without notice

export interface HookNamespaceEntry {
  Flags: number;
  LedgerEntryType: string;
  HookStateData: string;
  HookStateKey: string;
  OwnerNode: string;
  index: string;
}

export interface HookNamespaceResponse {
  /**
   * Unique Address of the account this request corresponds to. This is the
   * "perspective account" for purpose of the trust lines.
   */
  account: string;
  /**
   * Array of trust line objects. If the number of trust lines is large, only
   * returns up to the limit at a time.
   */
  namespace_entries: HookNamespaceEntry[];
  /**
   * The ledger index of the current open ledger, which was used when
   * retrieving this information.
   */
  ledger_current_index?: number;
  /**
   * The ledger index of the ledger version that was used when retrieving
   * this data.
   */
  ledger_index?: number;

  namespace_id?: string;

  validated?: boolean;
}
