import _ from "lodash";
import { BigNumber as GlobalBigNumber } from "bignumber.js";
const BigNumber = GlobalBigNumber.clone({ DECIMAL_PLACES: 40 });
import { removeUndefined } from "../../common";
import { ledgerTimeToTimestamp } from "../../models";
import { normalizeNodes } from "../utils";
import { parseOrderbookQuality } from "./orderbook_quality";
import parseCurrencyAmount from "../ledger/currency-amount";

import { getNativeCurrency } from "../../client";

const lsfSell = 0x00020000; // see "lsfSell" flag in rippled source code

function convertOrderChange(order) {
  const takerGets = order.taker_gets;
  const takerPays = order.taker_pays;
  const direction = order.sell ? "sell" : "buy";
  const quantity = direction === "buy" ? takerPays : takerGets;
  const totalPrice = direction === "buy" ? takerGets : takerPays;
  return removeUndefined({
    direction: direction,
    quantity: quantity,
    totalPrice: totalPrice,
    sequence: order.sequence,
    status: order.status,
    makerExchangeRate: order.quality,
    expirationTime: order.expiration,
  });
}

function getExpirationTime(node) {
  const expirationTime = node.finalFields.Expiration || node.newFields.Expiration;
  if (expirationTime === undefined) {
    return undefined;
  }
  return new Date(ledgerTimeToTimestamp(expirationTime)).toISOString();
}

function getQuality(node) {
  const takerGets = node.finalFields.TakerGets || node.newFields.TakerGets;
  const takerPays = node.finalFields.TakerPays || node.newFields.TakerPays;
  const takerGetsCurrency = takerGets.currency || getNativeCurrency();
  const takerPaysCurrency = takerPays.currency || getNativeCurrency();
  const bookDirectory = node.finalFields.BookDirectory || node.newFields.BookDirectory;
  const qualityHex = bookDirectory.substring(bookDirectory.length - 16);
  return parseOrderbookQuality(qualityHex, takerGetsCurrency, takerPaysCurrency);
}

function parseOrderStatus(node) {
  if (node.diffType === "CreatedNode") {
    // "submitted" is more conventional, but could be confusing in the
    // context of Ripple
    return "created";
  }

  if (node.diffType === "ModifiedNode") {
    return "partially-filled";
  }

  if (node.diffType === "DeletedNode") {
    // A filled order has previous fields
    if (node.previousFields.hasOwnProperty("TakerPays")) {
      return "filled";
    }

    // A cancelled order has no previous fields
    // google search for "cancelled order" shows 5x more results than
    // "canceled order", even though both spellings are correct
    return "cancelled";
  }
  return undefined;
}

function calculateDelta(finalAmount, previousAmount) {
  if (previousAmount) {
    const finalValue = new BigNumber(finalAmount.value);
    const previousValue = new BigNumber(previousAmount.value);
    return finalValue.minus(previousValue).abs().toString();
  }
  return "0";
}

function parseChangeAmount(node, type) {
  const status = parseOrderStatus(node);

  if (status === "cancelled") {
    // Canceled orders do not have PreviousFields; FinalFields
    // have positive values
    return parseCurrencyAmount(node.finalFields[type]);
  } else if (status === "created") {
    return parseCurrencyAmount(node.newFields[type]);
  }
  const finalAmount = parseCurrencyAmount(node.finalFields[type]);
  const previousAmount = parseCurrencyAmount(node.previousFields[type]);
  const value = calculateDelta(finalAmount, previousAmount);
  return _.assign({}, finalAmount, { value: value });
}

function parseOrderChange(node) {
  const orderChange = convertOrderChange({
    taker_pays: parseChangeAmount(node, "TakerPays"),
    taker_gets: parseChangeAmount(node, "TakerGets"),
    // eslint-disable-next-line no-bitwise
    sell: (node.finalFields.Flags & lsfSell) !== 0,
    sequence: node.finalFields.Sequence || node.newFields.Sequence,
    status: parseOrderStatus(node),
    quality: getQuality(node),
    expiration: getExpirationTime(node),
  });

  Object.defineProperty(orderChange, "account", {
    value: node.finalFields.Account || node.newFields.Account,
  });

  return orderChange;
}

function groupByAddress(orderChanges) {
  return _.groupBy(orderChanges, function (change) {
    return change.account;
  });
}

/**
 * Computes the complete list of every Offer that changed in the ledger
 * as a result of the given transaction.
 * Returns changes grouped by Ripple account.
 *
 *  @param {Object} metadata - Transaction metadata as return by ripple-lib
 *  @returns {Object} - Orderbook changes grouped by Ripple account
 *
 */
function parseOrderbookChanges(metadata) {
  const nodes = normalizeNodes(metadata);

  const orderChanges = _.map(
    _.filter(nodes, function (node) {
      return node.entryType === "Offer";
    }),
    parseOrderChange
  );

  return groupByAddress(orderChanges);
}

export { parseOrderbookChanges };
