// https://github.com/XRPLF/xrpl.js/blob/1.x/src/common/constants.ts

import { txFlagIndices } from "./txflags";

// Ordering from https://developers.ripple.com/accountroot.html
const accountRootFlags = {
  // lsfDefaultRipple:
  // Enable rippling on trust lines by default.
  // Required for issuing addresses; discouraged for others.
  DefaultRipple: 0x00800000,

  // lsfDepositAuth:
  // Require account to auth deposits.
  // This account can only receive funds from transactions it sends,
  // or preauthorized accounts.
  DepositAuth: 0x01000000,

  // lsfDisableMaster:
  // Force regular key.
  // Disallows use of the master key.
  DisableMaster: 0x00100000,

  // lsfDisallowXRP:
  // Disallow sending XRP.
  // Not enforced by rippled; client applications should check.
  DisallowXRP: 0x00080000,

  // lsfGlobalFreeze:
  // Trustlines globally frozen.
  GlobalFreeze: 0x00400000,

  // lsfNoFreeze:
  // Permanently disallowed freezing trustlines.
  // Once enabled, cannot be disabled.
  NoFreeze: 0x00200000,

  // lsfPasswordSpent:
  // Password set fee is spent.
  // The account has used its free SetRegularKey transaction.
  PasswordSpent: 0x00010000,

  // lsfRequireAuth:
  // Require authorization to hold IOUs (issuances).
  RequireAuth: 0x00040000,

  // lsfRequireDestTag:
  // Require a DestinationTag for incoming payments.
  RequireDestTag: 0x00020000,
};

const AccountFlags = {
  passwordSpent: accountRootFlags.PasswordSpent,
  requireDestTag: accountRootFlags.RequireDestTag,
  requireAuth: accountRootFlags.RequireAuth,
  depositAuth: accountRootFlags.DepositAuth,
  disallowXRP: accountRootFlags.DisallowXRP,
  disableMaster: accountRootFlags.DisableMaster,
  noFreeze: accountRootFlags.NoFreeze,
  globalFreeze: accountRootFlags.GlobalFreeze,
  defaultRipple: accountRootFlags.DefaultRipple,
};

export interface Settings {
  passwordSpent?: boolean;
  requireDestTag?: boolean;
  requireAuth?: boolean;
  depositAuth?: boolean;
  disallowXRP?: boolean;
  disableMaster?: boolean;
  noFreeze?: boolean;
  globalFreeze?: boolean;
  defaultRipple?: boolean;
}

const AccountSetFlags = {
  requireDestTag: txFlagIndices.AccountSet.asfRequireDest,
  requireAuth: txFlagIndices.AccountSet.asfRequireAuth,
  depositAuth: txFlagIndices.AccountSet.asfDepositAuth,
  disallowXRP: txFlagIndices.AccountSet.asfDisallowXRP,
  disableMaster: txFlagIndices.AccountSet.asfDisableMaster,
  enableTransactionIDTracking: txFlagIndices.AccountSet.asfAccountTxnID,
  noFreeze: txFlagIndices.AccountSet.asfNoFreeze,
  globalFreeze: txFlagIndices.AccountSet.asfGlobalFreeze,
  defaultRipple: txFlagIndices.AccountSet.asfDefaultRipple,
};

const AccountFields = {
  EmailHash: {
    name: "emailHash",
    encoding: "hex",
    length: 32,
    defaults: "00000000000000000000000000000000",
  },
  WalletLocator: { name: "walletLocator" },
  MessageKey: { name: "messageKey" },
  Domain: { name: "domain", encoding: "hex" },
  TransferRate: { name: "transferRate", defaults: 0, shift: 9 },
  TickSize: { name: "tickSize", defaults: 0 },
};

export { AccountFields, AccountSetFlags, AccountFlags };
