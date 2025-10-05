import { XrplDefinitionsBase } from "ripple-binary-codec";
import { getNativeCurrency } from "../client";
import { BalanceChanges } from "./outcome/balance_changes";
import {
  parseBalanceChanges,
  parseLockedBalanceChanges,
  parseChannelChanges,
  parseCheckChanges,
  parseOrderbookChanges,
  parseNFTokenChanges,
  parseNFTokenOfferChanges,
  parseURITokenChanges,
  parseURITokenSellOfferChanges,
  parseAffectedObjects,
  parseHooksExecutions,
  parseEmittedTxns,
  parseEscrowChanges,
  parseUNLReportChanges,
  parseAmmChanges,
  parseDIDChanges,
  parseOracleChanges,
  parseDeliveredAmount,
  parseMPTokenIssuanceChanges,
  parseMPTokenChanges,
  parseCredentialChanges,
  parseDelegateChanges,
  parseRemarksChanges,
} from "./outcome/index";

import { parseTimestamp } from "./utils";
import { MAINNET_NATIVE_CURRENCY, XAHAU_NATIVE_CURRENCY, removeUndefined, dropsToXrp } from "../common";
import { Outcome } from "../types/outcome";

const ESCROW_TYPES = ["EscrowFinish", "EscrowCreate", "EscrowCancel"];
const CHANNEL_TYPES = ["PaymentChannelCreate", "PaymentChannelFund", "PaymentChannelClaim"];
const CHECK_TYPES = ["CheckCreate", "CheckCash", "CheckCancel"];
const NFTOKEN_TYPES = [
  "NFTokenMint",
  "NFTokenBurn",
  "NFTokenCreateOffer",
  "NFTokenCancelOffer",
  "NFTokenAcceptOffer",
  "NFTokenModify",
];
const URITOKEN_TYPES = [
  "Remit",
  "URITokenMint",
  "URITokenBurn",
  "URITokenBuy",
  "URITokenCreateSellOffer",
  "URITokenCancelSellOffer",
];
const AMM_TYPES = ["AMMBid", "AMMCreate", "AMMDelete", "AMMDeposit", "AMMWithdraw", "AMMVote", "AMMClawback"];
const DID_TYPES = ["DIDSet", "DIDDelete"];
const ORACLE_TYPES = ["OracleSet", "OracleDelete"];
const UNL_REPORT_TYPES = ["UNLReport"];
const MPTOKEN_TYPES = [
  "MPTokenIssuanceCreate",
  "MPTokenAuthorize",
  "MPTokenIssuanceSet",
  "MPTokenIssuanceDestroy",
  "Payment",
  "Clawback",
];
const CREDENTIAL_TYPES = ["CredentialCreate", "CredentialAccept", "CredentialDelete"];
const DELEGATE_TYPES = ["DelegateSet"];
const REMARKS_TYPES = ["SetRemarks"];

function parseOutcome(tx: any, nativeCurrency?: string, definitions?: XrplDefinitionsBase): Outcome | undefined {
  const metadata = tx.meta || tx.metaData;
  if (!metadata) {
    return undefined;
  }

  const balanceChanges = getBalanceChanges(tx, nativeCurrency || getNativeCurrency());

  return removeUndefined({
    result: tx.meta.TransactionResult,
    timestamp: parseTimestamp(tx.date),
    fee: dropsToXrp(tx.Fee),

    balanceChanges,
    lockedBalanceChanges: getLockedBalanceChanges(tx),
    orderbookChanges: getOrderbookChanges(tx),
    channelChanges: getChannelChanges(tx),
    checkChanges: getCheckChanges(tx),
    escrowChanges: getEscrowChanges(tx),
    nftokenChanges: getNFTokenChanges(tx),
    nftokenOfferChanges: getNFTokenOfferChanges(tx),
    uritokenChanges: getURITokenChanges(tx),
    uritokenSellOfferChanges: getURITokenSellOfferChanges(tx),
    affectedObjects: getAffectedObjects(tx),
    ammChanges: getAmmChanges(tx),
    didChanges: getDIDChanges(tx),
    oracleChanges: getOracleChanges(tx),
    mptokenIssuanceChanges: getMPTokenIssuanceChanges(tx, nativeCurrency || getNativeCurrency()),
    mptokenChanges: getMPTokenChanges(tx, nativeCurrency || getNativeCurrency()),
    credentialChanges: getCredentialChanges(tx, nativeCurrency || getNativeCurrency()),
    delegateChanges: getDelegateChanges(tx, nativeCurrency || getNativeCurrency()),
    remarksChanges: getRemarksChanges(tx, nativeCurrency || getNativeCurrency()),
    unlReportChanges: getUNLReportChanges(tx, nativeCurrency || getNativeCurrency()),
    hooksExecutions: getHooksExecutions(tx, nativeCurrency || getNativeCurrency()),
    emittedTxns: getEmittedTxns(tx, nativeCurrency || getNativeCurrency(), definitions), // only Xahau

    parentBatchID: tx.meta.ParentBatchID,
    ledgerIndex: tx.ledger_index || tx.inLedger,
    ledgerVersion: tx.ledger_index || tx.inLedger, // @deprecated, use ledgerIndex
    indexInLedger: tx.meta.TransactionIndex,
    deliveredAmount: parseDeliveredAmount(tx, balanceChanges as BalanceChanges),
  });
}

/**
 * XRPL and Xahau
 */
function getBalanceChanges(tx: any, nativeCurrency?: string): BalanceChanges | undefined {
  const balanceChanges = parseBalanceChanges(tx.meta, nativeCurrency, tx);

  return Object.keys(balanceChanges).length > 0 ? balanceChanges : undefined;
}

/**
 * only Xahau, EscrowFinish, EscrowCreate, EscrowCancel
 */
function getLockedBalanceChanges(tx: any): any {
  if (!ESCROW_TYPES.includes(tx.TransactionType)) {
    return undefined;
  }

  const lockedBalanceChanges = parseLockedBalanceChanges(tx.meta);

  return Object.keys(lockedBalanceChanges).length > 0 ? lockedBalanceChanges : undefined;
}

/**
 * XRPL and Xahau: OfferCreate, OfferCancel, etc...
 */
function getOrderbookChanges(tx: any): any {
  const orderbookChanges = parseOrderbookChanges(tx.meta);

  return Object.keys(orderbookChanges).length > 0 ? orderbookChanges : undefined;
}

/**
 * XRPL and Xahau: PaymentChannelCreate, PaymentChannelFund, PaymentChannelClaim
 */
function getChannelChanges(tx: any): any {
  if (!CHANNEL_TYPES.includes(tx.TransactionType)) {
    return undefined;
  }

  return parseChannelChanges(tx.meta);
}

/**
 * XRPL and Xahau: CheckCreate, CheckCash, CheckCancel
 */
function getCheckChanges(tx: any): any {
  if (!CHECK_TYPES.includes(tx.TransactionType)) {
    return undefined;
  }

  return parseCheckChanges(tx.meta);
}

/**
 * XRPL and Xahau: EscrowFinish, EscrowCreate, EscrowCancel
 */
function getEscrowChanges(tx: any): any {
  if (!ESCROW_TYPES.includes(tx.TransactionType)) {
    return undefined;
  }

  return parseEscrowChanges(tx);
}

/**
 * XRPL and Xahau
 */
function getAffectedObjects(tx: any): any {
  if (!NFTOKEN_TYPES.includes(tx.TransactionType) && !URITOKEN_TYPES.includes(tx.TransactionType)) {
    return undefined;
  }

  const affectedObjects = parseAffectedObjects(tx);

  return affectedObjects ? removeUndefined(affectedObjects) : undefined;
}

/**
 * XRPL and Xahau
 */
function getNFTokenChanges(tx: any): any {
  if (!NFTOKEN_TYPES.includes(tx.TransactionType)) {
    return undefined;
  }

  const nftokenChanges = parseNFTokenChanges(tx);

  return Object.keys(nftokenChanges).length > 0 ? nftokenChanges : undefined;
}

/**
 * XRPL and Xahau
 */
function getNFTokenOfferChanges(tx: any): any {
  if (!NFTOKEN_TYPES.includes(tx.TransactionType)) {
    return undefined;
  }

  const nftokenOfferChanges = parseNFTokenOfferChanges(tx);

  return Object.keys(nftokenOfferChanges).length > 0 ? nftokenOfferChanges : undefined;
}

/**
 * only Xahau
 */
function getURITokenChanges(tx: any): any {
  if (!URITOKEN_TYPES.includes(tx.TransactionType)) {
    return undefined;
  }

  const uritokenChanges = parseURITokenChanges(tx);

  return Object.keys(uritokenChanges).length > 0 ? uritokenChanges : undefined;
}

/**
 * only Xahau
 */
function getURITokenSellOfferChanges(tx: any): any {
  if (!URITOKEN_TYPES.includes(tx.TransactionType)) {
    return undefined;
  }

  const uritokenSellOfferChanges = parseURITokenSellOfferChanges(tx);

  return Object.keys(uritokenSellOfferChanges).length > 0 ? uritokenSellOfferChanges : undefined;
}

/**
 * only Xahau
 */
function getHooksExecutions(tx: any, nativeCurrency?: string): any {
  if (nativeCurrency !== XAHAU_NATIVE_CURRENCY) {
    return undefined;
  }

  return parseHooksExecutions(tx);
}

/**
 * only Xahau
 */
function getEmittedTxns(tx: any, nativeCurrency?: string, definitions?: XrplDefinitionsBase): any {
  if (nativeCurrency !== XAHAU_NATIVE_CURRENCY) {
    return undefined;
  }

  return parseEmittedTxns(tx, nativeCurrency, definitions);
}

/**
 * only XRPL
 */
function getAmmChanges(tx: any): any {
  if (!AMM_TYPES.includes(tx.TransactionType)) {
    return undefined;
  }

  const ammChanges = parseAmmChanges(tx.meta);

  return ammChanges ? removeUndefined(ammChanges) : undefined;
}

/**
 * only XRPL
 */
function getDIDChanges(tx: any): any {
  if (!DID_TYPES.includes(tx.TransactionType)) {
    return undefined;
  }

  const didChanges = parseDIDChanges(tx.meta);

  return didChanges ? removeUndefined(didChanges) : undefined;
}

/**
 * only XRPL
 */
function getOracleChanges(tx: any): any {
  if (!ORACLE_TYPES.includes(tx.TransactionType)) {
    return undefined;
  }

  const oracleChanges = parseOracleChanges(tx.meta);

  return oracleChanges ? removeUndefined(oracleChanges) : undefined;
}

/**
 * only Xahau
 */
function getUNLReportChanges(tx: any, nativeCurrency?: string): any {
  if (nativeCurrency !== XAHAU_NATIVE_CURRENCY) {
    return undefined;
  }

  if (!UNL_REPORT_TYPES.includes(tx.TransactionType)) {
    return undefined;
  }

  return parseUNLReportChanges(tx);
}

/**
 * only XRPL
 */
function getMPTokenChanges(tx: any, nativeCurrency?: string): any {
  if (nativeCurrency !== MAINNET_NATIVE_CURRENCY) {
    return undefined;
  }

  if (!MPTOKEN_TYPES.includes(tx.TransactionType)) {
    return undefined;
  }

  const mptokenChanges = parseMPTokenChanges(tx);

  return Object.keys(mptokenChanges).length > 0 ? mptokenChanges : undefined;
}

/**
 * only XRPL
 */
function getMPTokenIssuanceChanges(tx: any, nativeCurrency?: string): any {
  if (nativeCurrency !== MAINNET_NATIVE_CURRENCY) {
    return undefined;
  }

  // Can be modified by MPTOKEN_TYPES or any Payment related transactions

  const mptokenIssuanceChanges = parseMPTokenIssuanceChanges(tx);

  return Object.keys(mptokenIssuanceChanges).length > 0 ? mptokenIssuanceChanges : undefined;
}

/**
 * only XRPL
 */
function getCredentialChanges(tx: any, nativeCurrency?: string): any {
  if (nativeCurrency !== MAINNET_NATIVE_CURRENCY) {
    return undefined;
  }

  if (!CREDENTIAL_TYPES.includes(tx.TransactionType)) {
    return undefined;
  }

  return parseCredentialChanges(tx.meta);
}

/**
 * only XRPL
 */
function getDelegateChanges(tx: any, nativeCurrency?: string): any {
  if (nativeCurrency !== MAINNET_NATIVE_CURRENCY) {
    return undefined;
  }

  if (!DELEGATE_TYPES.includes(tx.TransactionType)) {
    return undefined;
  }

  return parseDelegateChanges(tx.meta);
}

/**
 * only XRPL
 */
function getRemarksChanges(tx: any, nativeCurrency?: string): any {
  if (nativeCurrency !== XAHAU_NATIVE_CURRENCY) {
    return undefined;
  }

  if (!REMARKS_TYPES.includes(tx.TransactionType)) {
    return undefined;
  }

  return parseRemarksChanges(tx);
}

export { parseOutcome };
