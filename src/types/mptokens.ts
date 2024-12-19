import { FormattedBaseSpecification } from "./specification";

/**
 * Transaction Flags for an MPTokenIssuanceCreate Transaction.
 *
 * @category Transaction Flags
 */
enum MPTokenIssuanceCreateFlags {
  /**
   * If set, indicates that the MPT can be locked both individually and globally.
   * If not set, the MPT cannot be locked in any way.
   */
  tfMPTCanLock = 0x00000002,
  /**
   * If set, indicates that individual holders must be authorized.
   * This enables issuers to limit who can hold their assets.
   */
  tfMPTRequireAuth = 0x00000004,
  /**
   * If set, indicates that individual holders can place their balances into an escrow.
   */
  tfMPTCanEscrow = 0x00000008,
  /**
   * 	If set, indicates that individual holders can trade their balances
   *  using the XRP Ledger DEX or AMM.
   */
  tfMPTCanTrade = 0x00000010,
  /**
   * If set, indicates that tokens may be transferred to other accounts
   *  that are not the issuer.
   */
  tfMPTCanTransfer = 0x00000020,
  /**
   * If set, indicates that the issuer may use the Clawback transaction
   * to clawback value from individual holders.
   */
  tfMPTCanClawback = 0x00000040,
}

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

enum MPTokenIssuanceSetFlags {
  /**
   * If set, indicates that issuer locks the MPT
   */
  tfMPTLock = 0x00000001,
  /**
   * If set, indicates that issuer unlocks the MPT
   */
  tfMPTUnlock = 0x00000002,
}

export const MPTokenIssuanceSetFlagsKeys = {
  lock: MPTokenIssuanceSetFlags.tfMPTLock,
  unlock: MPTokenIssuanceSetFlags.tfMPTUnlock,
};

export interface MPTokenIssuanceSetFlagsKeysInterface {
  lock?: boolean;
  unlock?: boolean;
}

enum MPTokenAuthorizeFlags {
  /**
   * If set and transaction is submitted by a holder, it indicates that the holder no
   * longer wants to hold the MPToken, which will be deleted as a result. If the the holder's
   * MPToken has non-zero balance while trying to set this flag, the transaction will fail. On
   * the other hand, if set and transaction is submitted by an issuer, it would mean that the
   * issuer wants to unauthorize the holder (only applicable for allow-listing),
   * which would unset the lsfMPTAuthorized flag on the MPToken.
   */
  tfMPTUnauthorize = 0x00000001,
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
  metadata?: string;
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
