import * as errors from "./errors";
import sha512Half from "./sha512Half";

export * from "./utils";
export { errors, sha512Half };

export const dropsInXRP = 1000000;

export const ACCOUNT_ZERO = "rrrrrrrrrrrrrrrrrrrrrhoLvTp";

// https://xrpl.org/accounts.html#special-addresses
export const BLACKHOLE_ACCOUNTS = [
  ACCOUNT_ZERO,
  "rrrrrrrrrrrrrrrrrrrrBZbvji",
  "rrrrrrrrrrrrrrrrrNAMEtxvNvQ",
  "rrrrrrrrrrrrrrrrrrrn5RM1rHd",
];
