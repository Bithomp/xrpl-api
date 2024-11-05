import { LedgerEntry, AccountSetAsfFlags } from "xrpl";
import BigNumber from "bignumber.js";

import { BLACKHOLE_ACCOUNTS } from "../common";
import { parseFlags } from "../parse/ledger/flags";
import { QueueData } from "../types/queue_data";

import { getNativeCurrency } from "../client";

// https://github.com/Xahau/xahaud/blob/dev/src/ripple/protocol/LedgerFormats.h
export enum XahauAccountRootFlags {
  lsfURITokenIssuer = 0x40000000, // True, has minted tokens in the past

  // conflict with LedgerEntry.AccountRootFlags.lsfAllowTrustLineClawback
  lsfDisallowIncomingRemit = 0x80000000, // True, no remits allowed to this account
}

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

// XRPL specific (default)
export const XRPLAccountRootFlagsKeys = {
  ...AccountRootFlagsKeys,

  amm: LedgerEntry.AccountRootFlags.lsfAMM,
  allowTrustLineClawback: LedgerEntry.AccountRootFlags.lsfAllowTrustLineClawback,
};

// Xahau specific
export const XahauAccountRootFlagsKeys = {
  ...AccountRootFlagsKeys,

  uriTokenIssuer: XahauAccountRootFlags.lsfURITokenIssuer,
  disallowIncomingRemit: XahauAccountRootFlags.lsfDisallowIncomingRemit,
};

export function getAccountRootFlagsKeys(): Record<string, number> {
  const nativeCurrency = getNativeCurrency();
  if (nativeCurrency === "XAH") {
    // Xahau specific
    return XahauAccountRootFlagsKeys;
  } else {
    // XRPL specific (default)
    return XRPLAccountRootFlagsKeys;
  }
}

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

  // XRPL specific
  amm?: boolean;
  allowTrustLineClawback?: boolean;

  // Xahau specific
  uriTokenIssuer?: boolean;
  disallowIncomingRemit?: boolean;
}

export enum XahauAccountSetAsfFlags {
  // conflict with AccountSetAsfFlags.asfAllowTrustLineClawback
  asfDisallowIncomingRemit = 16,
}

export const AccountSetFlags = {
  requireDestinationTag: AccountSetAsfFlags.asfRequireDest,
  requireAuthorization: AccountSetAsfFlags.asfRequireAuth,
  depositAuth: AccountSetAsfFlags.asfDepositAuth,
  disallowIncomingXRP: AccountSetAsfFlags.asfDisallowXRP,
  disableMasterKey: AccountSetAsfFlags.asfDisableMaster,
  enableTransactionIDTracking: AccountSetAsfFlags.asfAccountTxnID,
  noFreeze: AccountSetAsfFlags.asfNoFreeze,
  globalFreeze: AccountSetAsfFlags.asfGlobalFreeze,
  defaultRipple: AccountSetAsfFlags.asfDefaultRipple,
  authorizedMinter: AccountSetAsfFlags.asfAuthorizedNFTokenMinter,
  disallowIncomingNFTokenOffer: AccountSetAsfFlags.asfDisallowIncomingNFTokenOffer,
  disallowIncomingCheck: AccountSetAsfFlags.asfDisallowIncomingCheck,
  disallowIncomingPayChan: AccountSetAsfFlags.asfDisallowIncomingPayChan,
  disallowIncomingTrustline: AccountSetAsfFlags.asfDisallowIncomingTrustline,

  // XRPL specific
  allowTrustLineClawback: AccountSetAsfFlags.asfAllowTrustLineClawback,

  // Xahau specific
  disallowIncomingRemit: XahauAccountSetAsfFlags.asfDisallowIncomingRemit,
};

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
  RegularKey: { name: "regularKey" },
  NFTokenMinter: { name: "nftokenMinter" },
};

export interface AccountInfoResponse extends AccountSignerListResponse {
  /**
   * The AccountRoot ledger object with this account's information, as stored
   * in the ledger.
   * If requested, also includes Array of SignerList ledger objects
   * associated with this account for Multi-Signing. Since an account can own
   * at most one SignerList, this array must have exactly one member if it is
   * present.
   */
  account_data: AccountInfoDataResponse;
  /**
   * The ledger index of the current in-progress ledger, which was used when
   * retrieving this information.
   */
  ledger_current_index?: number;
  /**
   * The ledger index of the ledger version used when retrieving this
   * information. The information does not contain any changes from ledger
   * versions newer than this one.
   */
  ledger_index?: number;
  /**
   * Information about queued transactions sent by this account. This
   * information describes the state of the local rippled server, which may be
   * different from other servers in the peer-to-peer XRP Ledger network. Some
   * fields may be omitted because the values are calculated "lazily" by the
   * queuing mechanism.
   */
  queue_data?: QueueData;
  /**
   * True if this data is from a validated ledger version; if omitted or set
   * to false, this data is not final.
   */
  validated?: boolean;
}

export interface AccountSignerListResponse {
  signer_lists?: LedgerEntry.SignerList[];
}

export interface AccountInfoDataResponse extends LedgerEntry.AccountRoot, AccountSignerListResponse {}

export interface AccountFieldsInterface {
  blackholed?: boolean;
  emailHash?: string;
  walletLocator?: string;
  messageKey?: string;
  domain?: string;
  transferRate?: number;
  tickSize?: number;
  regularKey?: string;
  nftokenMinter?: string;
}

export interface AccountSettingsInterface extends AccountFieldsInterface, AccountRootFlagsKeysInterface {}

/**
 * @returns {AccountSettingsInterface} like
 * {
 *   requireAuthorization: true,
 *   disallowIncomingXRP: true,
 *   domain: "test.bithomp.com",
 * }
 */
export function getSettings(
  accountInfo: AccountInfoDataResponse,
  excludeFalse: boolean = true
): AccountSettingsInterface {
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
  return parseFlags(value, getAccountRootFlagsKeys(), options);
}

export function parseAccountFields(
  accountInfo: AccountInfoDataResponse,
  options: { excludeFalse?: boolean } = {}
): AccountFieldsInterface {
  const settings: AccountFieldsInterface = {};

  if (accountInfo.hasOwnProperty("signer_lists")) {
    if (
      // eslint-disable-next-line no-bitwise
      accountInfo.Flags & AccountRootFlagsKeys.disableMaster &&
      BLACKHOLE_ACCOUNTS.includes(accountInfo.RegularKey as string) &&
      accountInfo.signer_lists?.length === 0
    ) {
      settings.blackholed = true;
    } else if (!options.excludeFalse) {
      settings.blackholed = false;
    }
  }

  for (const fieldName in AccountFields) {
    const fieldValue = accountInfo[fieldName];
    // eslint-disable-next-line eqeqeq
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
