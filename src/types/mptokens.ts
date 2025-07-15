import { MPTokenIssuanceCreateFlags, MPTokenIssuanceSetFlags, MPTokenAuthorizeFlags } from "xrpl";
import { FormattedBaseSpecification } from "./specification";

export const MPTokenIssuanceCreateFlagsKeys = {
  canLock: MPTokenIssuanceCreateFlags.tfMPTCanLock,
  requireAuth: MPTokenIssuanceCreateFlags.tfMPTRequireAuth,
  canEscrow: MPTokenIssuanceCreateFlags.tfMPTCanEscrow,
  canTrade: MPTokenIssuanceCreateFlags.tfMPTCanTrade,
  canTransfer: MPTokenIssuanceCreateFlags.tfMPTCanTransfer,
  canClawback: MPTokenIssuanceCreateFlags.tfMPTCanClawback,
};

export interface MPTokenIssuanceCreateFlagsKeysInterface {
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

export interface MPTokenIssuanceSetFlagsKeysInterface {
  lock?: boolean;
  unlock?: boolean;
}

export const MPTokenAuthorizeFlagsKeys = {
  unauthorize: MPTokenAuthorizeFlags.tfMPTUnauthorize,
};

export interface MPTokenAuthorizeFlagsKeysInterface {
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
