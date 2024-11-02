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
  parseDeliveredAmount,
} from "./outcome/index";

import { parseTimestamp } from "./utils";
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
