import { LedgerEntry } from "xrpl";

export const AccountRootFlagsKeys = {
  passwordSpent: LedgerEntry.AccountRootFlags.lsfPasswordSpent,
  requireDestTag: LedgerEntry.AccountRootFlags.lsfRequireDestTag,
  requireAuth: LedgerEntry.AccountRootFlags.lsfRequireAuth,
  depositAuth: LedgerEntry.AccountRootFlags.lsfDepositAuth,
  disallowXRP: LedgerEntry.AccountRootFlags.lsfDisallowXRP,
  disableMaster: LedgerEntry.AccountRootFlags.lsfDisableMaster,
  noFreeze: LedgerEntry.AccountRootFlags.lsfNoFreeze,
  globalFreeze: LedgerEntry.AccountRootFlags.lsfGlobalFreeze,
  defaultRipple: LedgerEntry.AccountRootFlags.lsfDefaultRipple,
};

export const AccountFields = {
  EmailHash: { name: "emailHash", encoding: "hex", length: 32, defaults: "00000000000000000000000000000000" },
  WalletLocator: { name: "walletLocator" },
  MessageKey: { name: "messageKey" },
  Domain: { name: "domain", encoding: "hex" },
  TransferRate: { name: "transferRate", defaults: 0, shift: 9 },
  TickSize: { name: "tickSize", defaults: 0 },
};
