import { MPTokenIssuanceCreateFlags, MPTokenIssuanceSetFlags, MPTokenAuthorizeFlags } from "xrpl";
import { FormattedBaseSpecification } from "./specification";
import { TxGlobalFlagsKeysInterface, getTxGlobalFlagsKeys } from "./global";
import { MAINNET_NATIVE_CURRENCY } from "../common";

export const MPTokenIssuanceCreateFlagsKeys = {
  canLock: MPTokenIssuanceCreateFlags.tfMPTCanLock,
  requireAuth: MPTokenIssuanceCreateFlags.tfMPTRequireAuth,
  canEscrow: MPTokenIssuanceCreateFlags.tfMPTCanEscrow,
  canTrade: MPTokenIssuanceCreateFlags.tfMPTCanTrade,
  canTransfer: MPTokenIssuanceCreateFlags.tfMPTCanTransfer,
  canClawback: MPTokenIssuanceCreateFlags.tfMPTCanClawback,
};

const nativeCurrencyMPTokenIssuanceCreateFlags = {};

export function getMPTokenIssuanceCreateFlagsKeys(nativeCurrency?: string): Record<string, number> {
  if (!nativeCurrency) {
    nativeCurrency = MAINNET_NATIVE_CURRENCY; // eslint-disable-line no-param-reassign
  }

  if (!nativeCurrencyMPTokenIssuanceCreateFlags[nativeCurrency]) {
    nativeCurrencyMPTokenIssuanceCreateFlags[nativeCurrency] = {
      ...getTxGlobalFlagsKeys(nativeCurrency),
      ...MPTokenIssuanceCreateFlagsKeys,
    };
  }

  return nativeCurrencyMPTokenIssuanceCreateFlags[nativeCurrency];
}

export interface MPTokenIssuanceCreateFlagsKeysInterface extends TxGlobalFlagsKeysInterface {
  canLock?: boolean;
  requireAuth?: boolean;
  canEscrow?: boolean;
  canTrade?: boolean;
  canTransfer?: boolean;
  canClawback?: boolean;
}

export const MPTokenIssuanceSetFlagsKeys = {
  lock: MPTokenIssuanceSetFlags.tfMPTLock,
  unlock: MPTokenIssuanceSetFlags.tfMPTUnlock,
};

const nativeCurrencyMPTokenIssuanceSetFlags = {};

export function getMPTokenIssuanceSetFlagsKeys(nativeCurrency?: string): Record<string, number> {
  if (!nativeCurrency) {
    nativeCurrency = MAINNET_NATIVE_CURRENCY; // eslint-disable-line no-param-reassign
  }

  if (!nativeCurrencyMPTokenIssuanceSetFlags[nativeCurrency]) {
    nativeCurrencyMPTokenIssuanceSetFlags[nativeCurrency] = {
      ...getTxGlobalFlagsKeys(nativeCurrency),
      ...MPTokenIssuanceSetFlagsKeys,
    };
  }

  return nativeCurrencyMPTokenIssuanceSetFlags[nativeCurrency];
}

export interface MPTokenIssuanceSetFlagsKeysInterface extends TxGlobalFlagsKeysInterface {
  lock?: boolean;
  unlock?: boolean;
}

export const MPTokenAuthorizeFlagsKeys = {
  unauthorize: MPTokenAuthorizeFlags.tfMPTUnauthorize,
};

const nativeCurrencyMPTokenAuthorizeFlags = {};

export function getMPTokenAuthorizeFlagsKeys(nativeCurrency?: string): Record<string, number> {
  if (!nativeCurrency) {
    nativeCurrency = MAINNET_NATIVE_CURRENCY; // eslint-disable-line no-param-reassign
  }

  if (!nativeCurrencyMPTokenAuthorizeFlags[nativeCurrency]) {
    nativeCurrencyMPTokenAuthorizeFlags[nativeCurrency] = {
      ...getTxGlobalFlagsKeys(nativeCurrency),
      ...MPTokenAuthorizeFlagsKeys,
    };
  }

  return nativeCurrencyMPTokenAuthorizeFlags[nativeCurrency];
}

export interface MPTokenAuthorizeFlagsKeysInterface extends TxGlobalFlagsKeysInterface {
  unauthorize?: boolean;
}

export type FormattedMPTokenAuthorizeSpecification = {
  flags?: MPTokenAuthorizeFlagsKeysInterface;
  holder?: string;
  mptIssuanceID?: string;
} & FormattedBaseSpecification;

export type FormattedMPTokenIssuanceCreateSpecification = {
  issuer?: string;
  sequence?: number;
  scale?: number;
  flags?: MPTokenIssuanceCreateFlagsKeysInterface;
  metadata?: string | null;
  maximumAmount?: string;
  transferFee?: number;
} & FormattedBaseSpecification;

export type FormattedMPTokenIssuanceDestroySpecification = {
  mptIssuanceID?: string;
} & FormattedBaseSpecification;

export type FormattedMPTokenIssuanceSetSpecification = {
  flags?: MPTokenIssuanceSetFlagsKeysInterface;
  holder?: string;
  mptIssuanceID?: string;
} & FormattedBaseSpecification;
