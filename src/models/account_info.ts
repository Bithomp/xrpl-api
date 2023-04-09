import { LedgerEntry } from "xrpl";
import BigNumber from "bignumber.js";

import { BLACKHOLE_ACCOUNTS } from "../common";
import { parseFlags } from "../common/utils";

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
  disallowIncomingNFTokenOffer: LedgerEntry.AccountRootFlags.lsfDisallowIncomingNFTokenOffer,
  disallowIncomingCheck: LedgerEntry.AccountRootFlags.lsfDisallowIncomingCheck,
  disallowIncomingPayChan: LedgerEntry.AccountRootFlags.lsfDisallowIncomingPayChan,
  disallowIncomingTrustline: LedgerEntry.AccountRootFlags.lsfDisallowIncomingTrustline,
};

export interface AccountRootFlagsKeysInterface {
  passwordSpent?: boolean;
  requireDestTag?: boolean;
  requireAuth?: boolean;
  depositAuth?: boolean;
  disallowXRP?: boolean;
  disableMaster?: boolean;
  noFreeze?: boolean;
  globalFreeze?: boolean;
  defaultRipple?: boolean;
  disallowIncomingNFTokenOffer?: boolean;
  disallowIncomingCheck?: boolean;
  disallowIncomingPayChan?: boolean;
  disallowIncomingTrustline?: boolean;
}

export const SignerListFlagsKeys = {
  oneOwnerCount: LedgerEntry.SignerListFlags.lsfOneOwnerCount,
};

export interface SignerListFlagsKeysInterface {
  oneOwnerCount?: boolean;
}

export const AccountFields = {
  EmailHash: { name: "emailHash", encoding: "hex", length: 32, defaults: "00000000000000000000000000000000" },
  WalletLocator: { name: "walletLocator" },
  MessageKey: { name: "messageKey" },
  Domain: { name: "domain", encoding: "hex" },
  TransferRate: { name: "transferRate", defaults: 0, shift: 9 },
  TickSize: { name: "tickSize", defaults: 0 },
};

/**
 * @returns {object} like
 * {
 *   requireAuthorization: true,
 *   disallowIncomingXRP: true,
 *   domain: "test.bithomp.com",
 * }
 */
export function getSettings(accountInfo: any, excludeFalse: boolean = true): object {
  const parsedFlags = parseAccountFlags(accountInfo.Flags, { excludeFalse });
  const parsedFields = parseAccountFields(accountInfo, { excludeFalse });

  return {
    ...parsedFlags,
    ...parsedFields,
  };
}

export function parseAccountFlags(
  value: number,
  options: { excludeFalse?: boolean } = {}
): AccountRootFlagsKeysInterface {
  return parseFlags(value, AccountRootFlagsKeys, options);
}

export function parseAccountFields(accountInfo: any, options: { excludeFalse?: boolean } = {}): object {
  const settings: any = {};

  if (accountInfo.hasOwnProperty("signer_lists")) {
    if (
      // tslint:disable-next-line:no-bitwise
      accountInfo.Flags & AccountRootFlagsKeys.disableMaster &&
      BLACKHOLE_ACCOUNTS.includes(accountInfo.RegularKey) &&
      accountInfo.signer_lists.length === 0
    ) {
      settings.blackholed = true;
    } else if (!options.excludeFalse) {
      settings.blackholed = false;
    }
  }

  // tslint:disable-next-line:forin
  for (const fieldName in AccountFields) {
    const fieldValue = accountInfo[fieldName];
    if (fieldValue != null) {
      const info = AccountFields[fieldName];
      settings[info.name] = parseField(info, fieldValue);
    }
  }

  function parseField(info: any, value: any) {
    if (info.encoding === "hex" && !info.length) {
      // e.g. "domain"
      return Buffer.from(value, "hex").toString("ascii");
    }
    if (info.shift) {
      return new BigNumber(value).shiftedBy(-info.shift).toNumber();
    }
    return value;
  }

  return settings;
}

export function parseSignerListFlags(
  value: number,
  options: { excludeFalse?: boolean } = {}
): SignerListFlagsKeysInterface {
  return parseFlags(value, SignerListFlagsKeys, options);
}
