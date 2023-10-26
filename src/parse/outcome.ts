import {
  parseBalanceChanges,
  parseLockedBalanceChanges,
  parseChannelChanges,
  parseOrderbookChanges,
  parseNFTokenChanges,
  parseNFTokenOfferChanges,
  parseURITokenChanges,
  parseAffectedObjects,
} from "./outcome/index";

import parseAmount from "./ledger/amount";
import { isPartialPayment, parseTimestamp } from "./utils";
import { FormattedIssuedCurrencyAmount } from "../v1/common/types/objects";
import { removeUndefined, dropsToXrp } from "../common";
import { Outcome } from "../v1/transaction/types";

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
  if (tx.TransactionType !== "Payment" || tx.meta.TransactionResult !== "tesSUCCESS") {
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

  // DeliveredAmount field was introduced at
  // ledger 4594095 - after that point its absence
  // on a tx flagged as partial payment indicates
  // the full amount was transferred. The amount
  // transferred with a partial payment before
  // that date must be derived from metadata.
  if (tx.Amount && tx.ledger_index > 4594094) {
    return parseAmount(tx.Amount);
  }

  return undefined;
}

function parseOutcome(tx: any): Outcome | undefined {
  const metadata = tx.meta || tx.metaData;
  if (!metadata) {
    return undefined;
  }
  const balanceChanges = parseBalanceChanges(metadata);
  const lockedBalanceChanges = parseLockedBalanceChanges(metadata);
  const orderbookChanges = parseOrderbookChanges(metadata);
  const channelChanges = parseChannelChanges(metadata);
  const nftokenChanges = parseNFTokenChanges(tx);
  const nftokenOfferChanges = parseNFTokenOfferChanges(tx);
  const uritokenChanges = parseURITokenChanges(tx);
  const affectedObjects = parseAffectedObjects(tx);

  removeEmptyCounterpartyInBalanceChanges(balanceChanges);
  removeEmptyCounterpartyInBalanceChanges(lockedBalanceChanges);
  removeEmptyCounterpartyInOrderbookChanges(orderbookChanges);

  return removeUndefined({
    result: tx.meta.TransactionResult,
    timestamp: parseTimestamp(tx.date),
    fee: dropsToXrp(tx.Fee),
    balanceChanges,
    lockedBalanceChanges,
    orderbookChanges,
    channelChanges,
    nftokenChanges,
    nftokenOfferChanges,
    uritokenChanges,
    affectedObjects: affectedObjects ? removeUndefined(affectedObjects) : undefined,
    ledgerVersion: tx.ledger_index,
    indexInLedger: tx.meta.TransactionIndex,
    deliveredAmount: parseDeliveredAmount(tx),
  });
}

export { parseOutcome };
