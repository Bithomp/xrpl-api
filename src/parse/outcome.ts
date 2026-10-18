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
  parseAmendmentChanges,
  parseUNLReportChanges,
  parseAmmChanges,
  parseDIDChanges,
  parseOracleChanges,
  parseDeliveredAmount,
  parseMPTokenIssuanceChanges,
  parseMPTokenChanges,
  parseCredentialChanges,
  parseDelegateChanges,
  parseSponsorshipChanges,
  parseRemarksChanges,
  parseCronChanges,
  parseAccountSettingChanges,
} from "./outcome/index";

import { parseTimestamp } from "./utils";
import { MAINNET_NATIVE_CURRENCY, XAHAU_NATIVE_CURRENCY, removeUndefined, dropsToXrp } from "../common";
import { Outcome } from "../types/outcome";

const ESCROW_TYPES = new Set(["EscrowFinish", "EscrowCreate", "EscrowCancel"]);
const CHANNEL_TYPES = new Set(["PaymentChannelCreate", "PaymentChannelFund", "PaymentChannelClaim"]);
const CHECK_TYPES = new Set(["CheckCreate", "CheckCash", "CheckCancel"]);
const NFTOKEN_TYPES = new Set([
  "NFTokenMint",
  "NFTokenBurn",
  "NFTokenCreateOffer",
  "NFTokenCancelOffer",
  "NFTokenAcceptOffer",
  "NFTokenModify",
]);
const URITOKEN_TYPES = new Set([
  "Remit",
  "URITokenMint",
  "URITokenBurn",
  "URITokenBuy",
  "URITokenCreateSellOffer",
  "URITokenCancelSellOffer",
  "SetRemarks",
]);
const AMM_TYPES = new Set(["AMMBid", "AMMCreate", "AMMDelete", "AMMDeposit", "AMMWithdraw", "AMMVote", "AMMClawback"]);
const DID_TYPES = new Set(["DIDSet", "DIDDelete"]);
const ORACLE_TYPES = new Set(["OracleSet", "OracleDelete"]);
const UNL_REPORT_TYPES = new Set(["UNLReport"]);
const MPTOKEN_TYPES = new Set([
  "MPTokenIssuanceCreate",
  "MPTokenAuthorize",
  "MPTokenIssuanceSet",
  "MPTokenIssuanceDestroy",
  "ConfidentialMPTConvert",
  "ConfidentialMPTConvertBack",
  "ConfidentialMPTClawback",
  "Payment",
  "Clawback",
  "EscrowFinish",
  "EscrowCreate",
  "EscrowCancel",
]);
const CREDENTIAL_TYPES = new Set(["CredentialCreate", "CredentialAccept", "CredentialDelete"]);
const DELEGATE_TYPES = new Set(["DelegateSet"]);
const REMARKS_TYPES = new Set(["SetRemarks"]);
const CRON_TYPES = new Set(["Cron", "CronSet"]);
const AMENDMENT_TYPES = new Set(["EnableAmendment"]);
const ACCOUNT_SETTING_TYPES = new Set(["AccountSet"]);

function parseOutcome(tx: any, nativeCurrency?: string, definitions?: XrplDefinitionsBase): Outcome | undefined {
  const metadata = tx.meta || tx.metaData;
  if (!metadata) {
    return undefined;
  }

  const resolvedNativeCurrency = nativeCurrency || getNativeCurrency();
  const txType = tx.TransactionType;
  const balanceChanges = getBalanceChanges(tx, resolvedNativeCurrency);

  return removeUndefined({
    result: metadata.TransactionResult,
    timestamp: parseTimestamp(tx.date),
    fee: dropsToXrp(tx.Fee),

    settingsChanges: getSettingsChanges(tx, txType),
    balanceChanges,
    lockedBalanceChanges: getLockedBalanceChanges(tx, txType),
    orderbookChanges: getOrderbookChanges(tx),
    channelChanges: getChannelChanges(tx, txType),
    checkChanges: getCheckChanges(tx, txType),
    escrowChanges: getEscrowChanges(tx, txType),
    amendmentChanges: getAmendmentChanges(tx, txType),
    nftokenChanges: getNFTokenChanges(tx, txType),
    nftokenOfferChanges: getNFTokenOfferChanges(tx, txType),
    uritokenChanges: getURITokenChanges(tx, txType),
    uritokenSellOfferChanges: getURITokenSellOfferChanges(tx, txType),
    affectedObjects: getAffectedObjects(tx, txType),
    ammChanges: getAmmChanges(tx, txType),
    didChanges: getDIDChanges(tx, txType),
    oracleChanges: getOracleChanges(tx, txType),
    mptokenIssuanceChanges: getMPTokenIssuanceChanges(tx, resolvedNativeCurrency),
    mptokenChanges: getMPTokenChanges(tx, resolvedNativeCurrency),
    credentialChanges: getCredentialChanges(tx, resolvedNativeCurrency),
    delegateChanges: getDelegateChanges(tx, resolvedNativeCurrency),
    sponsorshipChanges: getSponsorshipChanges(tx, resolvedNativeCurrency),
    remarksChanges: getRemarksChanges(tx, resolvedNativeCurrency),
    cronChanges: getCronChanges(tx, resolvedNativeCurrency),
    unlReportChanges: getUNLReportChanges(tx, resolvedNativeCurrency),
    hooksExecutions: getHooksExecutions(tx, resolvedNativeCurrency),
    emittedTxns: getEmittedTxns(tx, resolvedNativeCurrency, definitions), // only Xahau

    parentBatchID: metadata.ParentBatchID,
    ledgerIndex: tx.ledger_index || tx.inLedger,
    ledgerVersion: tx.ledger_index || tx.inLedger, // @deprecated, use ledgerIndex
    indexInLedger: metadata.TransactionIndex,
    deliveredAmount: parseDeliveredAmount(tx, balanceChanges as BalanceChanges),
  });
}

/**
 * XRPL and Xahau
 */
function getBalanceChanges(tx: any, nativeCurrency?: string): BalanceChanges | undefined {
  const metadata = tx.meta || tx.metaData;
  const balanceChanges = parseBalanceChanges(metadata, nativeCurrency, tx);

  return Object.keys(balanceChanges).length > 0 ? balanceChanges : undefined;
}

/**
 * only Xahau, EscrowFinish, EscrowCreate, EscrowCancel
 */
function getLockedBalanceChanges(tx: any, txType?: string): any {
  if (!txType || !ESCROW_TYPES.has(txType)) {
    return undefined;
  }

  const lockedBalanceChanges = parseLockedBalanceChanges(tx.meta || tx.metaData);

  return Object.keys(lockedBalanceChanges).length > 0 ? lockedBalanceChanges : undefined;
}

/**
 * XRPL and Xahau: OfferCreate, OfferCancel, etc...
 */
function getOrderbookChanges(tx: any): any {
  const orderbookChanges = parseOrderbookChanges(tx.meta || tx.metaData);

  return Object.keys(orderbookChanges).length > 0 ? orderbookChanges : undefined;
}

/**
 * XRPL and Xahau: PaymentChannelCreate, PaymentChannelFund, PaymentChannelClaim
 */
function getChannelChanges(tx: any, txType?: string): any {
  if (!txType || !CHANNEL_TYPES.has(txType)) {
    return undefined;
  }

  return parseChannelChanges(tx.meta || tx.metaData);
}

/**
 * XRPL and Xahau: CheckCreate, CheckCash, CheckCancel
 */
function getCheckChanges(tx: any, txType?: string): any {
  if (!txType || !CHECK_TYPES.has(txType)) {
    return undefined;
  }

  return parseCheckChanges(tx.meta || tx.metaData);
}

/**
 * XRPL and Xahau: EscrowFinish, EscrowCreate, EscrowCancel
 */
function getEscrowChanges(tx: any, txType?: string): any {
  if (!txType || !ESCROW_TYPES.has(txType)) {
    return undefined;
  }

  return parseEscrowChanges(tx);
}

/**
 * XRPL and Xahau: EscrowFinish, EscrowCreate, EscrowCancel
 */
function getAmendmentChanges(tx: any, txType?: string): any {
  if (!txType || !AMENDMENT_TYPES.has(txType)) {
    return undefined;
  }

  return parseAmendmentChanges(tx);
}

function getSettingsChanges(tx: any, txType?: string): any {
  if (!txType || !ACCOUNT_SETTING_TYPES.has(txType)) {
    return undefined;
  }

  return parseAccountSettingChanges(tx.meta || tx.metaData);
}

/**
 * XRPL and Xahau
 */
function getAffectedObjects(tx: any, txType?: string): any {
  if (!txType || (!NFTOKEN_TYPES.has(txType) && !URITOKEN_TYPES.has(txType))) {
    return undefined;
  }

  const affectedObjects = parseAffectedObjects(tx);

  return affectedObjects ? removeUndefined(affectedObjects) : undefined;
}

/**
 * XRPL and Xahau
 */
function getNFTokenChanges(tx: any, txType?: string): any {
  if (!txType || !NFTOKEN_TYPES.has(txType)) {
    return undefined;
  }

  const nftokenChanges = parseNFTokenChanges(tx);

  return Object.keys(nftokenChanges).length > 0 ? nftokenChanges : undefined;
}

/**
 * XRPL and Xahau
 */
function getNFTokenOfferChanges(tx: any, txType?: string): any {
  if (!txType || !NFTOKEN_TYPES.has(txType)) {
    return undefined;
  }

  const nftokenOfferChanges = parseNFTokenOfferChanges(tx);

  return Object.keys(nftokenOfferChanges).length > 0 ? nftokenOfferChanges : undefined;
}

/**
 * only Xahau
 */
function getURITokenChanges(tx: any, txType?: string): any {
  if (!txType || !URITOKEN_TYPES.has(txType)) {
    return undefined;
  }

  const uritokenChanges = parseURITokenChanges(tx);

  return Object.keys(uritokenChanges).length > 0 ? uritokenChanges : undefined;
}

/**
 * only Xahau
 */
function getURITokenSellOfferChanges(tx: any, txType?: string): any {
  if (!txType || !URITOKEN_TYPES.has(txType)) {
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
function getAmmChanges(tx: any, txType?: string): any {
  if (!txType || !AMM_TYPES.has(txType)) {
    return undefined;
  }

  const ammChanges = parseAmmChanges(tx.meta || tx.metaData);

  return ammChanges ? removeUndefined(ammChanges) : undefined;
}

/**
 * only XRPL
 */
function getDIDChanges(tx: any, txType?: string): any {
  if (!txType || !DID_TYPES.has(txType)) {
    return undefined;
  }

  const didChanges = parseDIDChanges(tx.meta || tx.metaData);

  return didChanges ? removeUndefined(didChanges) : undefined;
}

/**
 * only XRPL
 */
function getOracleChanges(tx: any, txType?: string): any {
  if (!txType || !ORACLE_TYPES.has(txType)) {
    return undefined;
  }

  const oracleChanges = parseOracleChanges(tx.meta || tx.metaData);

  return oracleChanges ? removeUndefined(oracleChanges) : undefined;
}

/**
 * only Xahau
 */
function getUNLReportChanges(tx: any, nativeCurrency?: string): any {
  if (nativeCurrency !== XAHAU_NATIVE_CURRENCY) {
    return undefined;
  }

  if (!tx.TransactionType || !UNL_REPORT_TYPES.has(tx.TransactionType)) {
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

  if (!tx.TransactionType || !MPTOKEN_TYPES.has(tx.TransactionType)) {
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

  if (!tx.TransactionType || !CREDENTIAL_TYPES.has(tx.TransactionType)) {
    return undefined;
  }

  return parseCredentialChanges(tx.meta || tx.metaData);
}

/**
 * only XRPL
 */
function getDelegateChanges(tx: any, nativeCurrency?: string): any {
  if (nativeCurrency !== MAINNET_NATIVE_CURRENCY) {
    return undefined;
  }

  if (!tx.TransactionType || !DELEGATE_TYPES.has(tx.TransactionType)) {
    return undefined;
  }

  return parseDelegateChanges(tx.meta || tx.metaData);
}

function getSponsorshipChanges(tx: any, nativeCurrency?: string): any[] | undefined {
  if (nativeCurrency !== MAINNET_NATIVE_CURRENCY) {
    return undefined;
  }

  return parseSponsorshipChanges(tx.meta || tx.metaData);
}

/**
 * only Xahau
 */
function getRemarksChanges(tx: any, nativeCurrency?: string): any {
  if (nativeCurrency !== XAHAU_NATIVE_CURRENCY) {
    return undefined;
  }

  if (!tx.TransactionType || !REMARKS_TYPES.has(tx.TransactionType)) {
    return undefined;
  }

  return parseRemarksChanges(tx);
}

/**
 * only Xahau
 */
function getCronChanges(tx: any, nativeCurrency?: string): any {
  if (nativeCurrency !== XAHAU_NATIVE_CURRENCY) {
    return undefined;
  }

  if (!tx.TransactionType || !CRON_TYPES.has(tx.TransactionType)) {
    return undefined;
  }

  return parseCronChanges(tx);
}
export { parseOutcome };
