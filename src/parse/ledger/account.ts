import { ACCOUNT_ZERO } from "../../common";

export function parseAccount(account: string): string {
  return account === "" ? ACCOUNT_ZERO : account;
}
