import { XrplDefinitionsBase } from "ripple-binary-codec";
import {
  parseBalanceChanges,
  parseLockedBalanceChanges,
  parseChannelChanges,
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
} from "./outcome/index";

import { parseImportBlob } from "./ledger/import";

import parseAmount from "./ledger/amount";
import { isPartialPayment, parseTimestamp } from "./utils";
import { FormattedIssuedCurrencyAmount } from "../types";
import { removeUndefined, dropsToXrp } from "../common";
import { Outcome } from "../types/outcome";

type OfferDescription = {
  direction: string;
  quantity: any;
  totalPrice: any;
  sequence: number;
  status: string;
  makerExchangeRate: string;
};

type Orderbook = {
  [key: string]: OfferDescription[];
};

type BalanceSheetItem = {
  counterparty: string;
  currency: string;
  value: string;
};

type BalanceSheet = {
  [key: string]: BalanceSheetItem[];
};

function removeEmptyCounterparty(amount) {
  if (amount.counterparty === "") {
    delete amount.counterparty;
  }
}

function removeEmptyCounterpartyInBalanceChanges(balanceChanges: BalanceSheet) {
  Object.entries(balanceChanges).forEach(([_, changes]) => {
    changes.forEach(removeEmptyCounterparty);
  });
}

function removeEmptyCounterpartyInOrderbookChanges(orderbookChanges: Orderbook) {
  Object.entries(orderbookChanges).forEach(([_, changes]) => {
    changes.forEach((change) => {
      Object.entries(change).forEach(removeEmptyCounterparty);
    });
  });
}

function parseDeliveredAmount(tx: any): FormattedIssuedCurrencyAmount | undefined {
  if (!["Import", "Payment"].includes(tx.TransactionType) || tx.meta.TransactionResult !== "tesSUCCESS") {
    return undefined;
  }

  if (tx.meta.delivered_amount && tx.meta.delivered_amount === "unavailable") {
    return undefined;
  }

  // parsable delivered_amount
  if (tx.meta.delivered_amount) {
    return parseAmount(tx.meta.delivered_amount);
  }

  // DeliveredAmount only present on partial payments
  if (tx.meta.DeliveredAmount) {
    return parseAmount(tx.meta.DeliveredAmount);
  }

  // no partial payment flag, use tx.Amount
  if (tx.Amount && !isPartialPayment(tx)) {
    return parseAmount(tx.Amount);
  }

  // DeliveredAmount for Import tx
  if (tx.TransactionType === "Import") {
    // take balance changes from meta
    const balanceChanges = parseBalanceChanges(tx.meta);
    const blob = parseImportBlob(tx.Blob);

    if (typeof blob === "string") {
      return undefined;
    }
    const account = blob.transaction.tx.Account;
    const balanceChange = balanceChanges[account];
    if (!balanceChange || balanceChange.length !== 1) {
      return undefined;
    }

    // currency is native
    return {
      currency: balanceChange[0].currency,
      value: balanceChange[0].value,
    };
  }

  return undefined;
}

function parseOutcome(tx: any, nativeCurrency?: string, definitions?: XrplDefinitionsBase): Outcome | undefined {
  const metadata = tx.meta || tx.metaData;
  if (!metadata) {
    return undefined;
  }
  const balanceChanges = parseBalanceChanges(metadata, nativeCurrency);
  const lockedBalanceChanges = parseLockedBalanceChanges(metadata);
  const orderbookChanges = parseOrderbookChanges(metadata);
  const channelChanges = parseChannelChanges(metadata);
  const escrowChanges = parseEscrowChanges(tx);
  const nftokenChanges = parseNFTokenChanges(tx);
  const nftokenOfferChanges = parseNFTokenOfferChanges(tx);
  const uritokenChanges = parseURITokenChanges(tx);
  const uritokenSellOfferChanges = parseURITokenSellOfferChanges(tx);
  const affectedObjects = parseAffectedObjects(tx);
  const hooksExecutions = parseHooksExecutions(tx);
  const emittedTxns = parseEmittedTxns(tx, definitions);
  const unlReportChanges = parseUNLReportChanges(tx);
  const ammChanges = parseAmmChanges(metadata);
  const didChanges = parseDIDChanges(metadata);
  const oracleChanges = parseOracleChanges(metadata);

  removeEmptyCounterpartyInBalanceChanges(balanceChanges);
  removeEmptyCounterpartyInBalanceChanges(lockedBalanceChanges);
  removeEmptyCounterpartyInOrderbookChanges(orderbookChanges);

  return removeUndefined({
    result: tx.meta.TransactionResult,
    timestamp: parseTimestamp(tx.date),
    fee: dropsToXrp(tx.Fee),
    balanceChanges,
    lockedBalanceChanges: Object.keys(lockedBalanceChanges).length > 0 ? lockedBalanceChanges : undefined,
    orderbookChanges: Object.keys(orderbookChanges).length > 0 ? orderbookChanges : undefined,
    channelChanges,
    escrowChanges,
    nftokenChanges: Object.keys(nftokenChanges).length > 0 ? nftokenChanges : undefined,
    nftokenOfferChanges: Object.keys(nftokenOfferChanges).length > 0 ? nftokenOfferChanges : undefined,
    uritokenChanges: Object.keys(uritokenChanges).length > 0 ? uritokenChanges : undefined,
    uritokenSellOfferChanges: Object.keys(uritokenSellOfferChanges).length > 0 ? uritokenSellOfferChanges : undefined,
    affectedObjects: affectedObjects ? removeUndefined(affectedObjects) : undefined,
    ammChanges: ammChanges ? removeUndefined(ammChanges) : undefined,
    didChanges: didChanges ? removeUndefined(didChanges) : undefined,
    oracleChanges: oracleChanges ? removeUndefined(oracleChanges) : undefined,
    unlReportChanges,
    hooksExecutions,
    emittedTxns,
    ledgerVersion: tx.ledger_index,
    indexInLedger: tx.meta.TransactionIndex,
    deliveredAmount: parseDeliveredAmount(tx),
  });
}

export { parseOutcome };
