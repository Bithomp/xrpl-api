export type LedgerIndex = number | ("validated" | "closed" | "current");

export type StreamType =
  | "consensus"
  | "ledger"
  | "manifests"
  | "peer_status"
  | "transactions"
  | "transactions_proposed"
  | "server"
  | "validations";
