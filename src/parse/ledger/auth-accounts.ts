import { AuthAccount } from "xrpl";

function parseAuthAccounts(authAccounts?: AuthAccount[]): string[] | undefined {
  if (!authAccounts) {
    return undefined;
  }

  const result: string[] = [];
  for (const authAccount of authAccounts) {
    if (authAccount.AuthAccount.Account) {
      result.push(authAccount.AuthAccount.Account);
    }
  }

  if (result.length === 0) {
    return undefined;
  }

  return result;
}

export default parseAuthAccounts;
