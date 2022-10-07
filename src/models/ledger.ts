const RIPPLE_UNIX_DIFF = 946684800;

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

export function unixTimeToLedgerTime(time: number): number {
  return time - RIPPLE_UNIX_DIFF;
}

export function ledgerTimeToUnixTime(ledgerTime: number): number {
  return ledgerTime + RIPPLE_UNIX_DIFF;
}

export function ledgerTimeToTimestamp(ledgerTime: number): number {
  return ledgerTimeToUnixTime(ledgerTime) * 1000;
}
