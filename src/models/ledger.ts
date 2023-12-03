export const RIPPLE_UNIX_DIFF = 946684800;

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

/**
 * @param {Number} ledgerTime (seconds since 1/1/2000 GMT)
 * @return {Number} s since unix epoch
 */
export function ledgerTimeToUnixTime(ledgerTime: number): number {
  return ledgerTime + RIPPLE_UNIX_DIFF;
}

/**
 * @param {Number} ledgerTime (seconds since 1/1/2000 GMT)
 * @return {Number} ms since unix epoch
 */
export function ledgerTimeToTimestamp(ledgerTime: number): number {
  return ledgerTimeToUnixTime(ledgerTime) * 1000;
}

/**
 * @param {Number} ledgerTime (seconds since 1/1/2000 GMT)
 * @return {String} ISO 8601 time string
 */
export function ledgerTimeToISO8601(ledgerTime: number): string {
  return new Date(ledgerTimeToTimestamp(ledgerTime)).toISOString();
}
