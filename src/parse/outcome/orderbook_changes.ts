import _ from "lodash";
import GlobalBigNumber from "bignumber.js";
const BigNumber = GlobalBigNumber.clone({ DECIMAL_PLACES: 40 });
import { LedgerEntry, TransactionMetadata } from "xrpl";
import { removeUndefined } from "../../common";
import { ledgerTimeToTimestamp } from "../../models";
import { NormalizedNode, normalizeNode } from "../utils";
import { parseOrderbookQuality } from "./orderbook_quality";
import parseCurrencyAmount from "../ledger/currency-amount";
import parseOfferFlags from "../ledger/offer-flags";
import {
  IssuedCurrencyAmount,
  FormattedAmount,
  FormattedIssuedCurrencyAmount,
  OfferFlagsKeysInterface,
} from "../../types";

import { getNativeCurrency } from "../../client";

type OfferDescription = {
  flags: OfferFlagsKeysInterface;
  account?: string;
  sequence: number;
  takerGets?: FormattedAmount;
  takerPays?: FormattedAmount;
  status?: string;
  makerExchangeRate: string;
  expirationTime?: string;
  domainID?: string;

  direction: string; // @deprecated
  quantity: any; // @deprecated
  totalPrice: any; // @deprecated
};

type Orderbook = {
  [key: string]: OfferDescription[];
};

function getExpirationTime(node: NormalizedNode): string | undefined {
  const expirationTime = (node.finalFields.Expiration || node.newFields.Expiration) as number;
  if (expirationTime === undefined) {
    return undefined;
  }
  return new Date(ledgerTimeToTimestamp(expirationTime)).toISOString();
}

function getQuality(node: NormalizedNode): string {
  const takerGets = (node.finalFields.TakerGets || node.newFields.TakerGets) as any;
  const takerPays = (node.finalFields.TakerPays || node.newFields.TakerPays) as any;

  // it is only for native currency we need to adjust quality
  const takerGetsCurrency = typeof takerGets === "string" ? getNativeCurrency() : null;
  const takerPaysCurrency = typeof takerPays === "string" ? getNativeCurrency() : null;

  const bookDirectory = (node.finalFields.BookDirectory || node.newFields.BookDirectory) as string;
  const qualityHex = bookDirectory.substring(bookDirectory.length - 16);

  return parseOrderbookQuality(qualityHex, takerGetsCurrency, takerPaysCurrency);
}

function parseOrderStatus(node: NormalizedNode): string | undefined {
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

function calculateDelta(
  finalAmount: FormattedIssuedCurrencyAmount,
  previousAmount: FormattedIssuedCurrencyAmount
): string {
  if (previousAmount) {
    const finalValue = new BigNumber(finalAmount.value);
    const previousValue = new BigNumber(previousAmount.value);
    return finalValue.minus(previousValue).abs().toString();
  }
  return "0";
}

function parseChangeAmount(node: NormalizedNode, type: string): FormattedAmount | undefined {
  const status = parseOrderStatus(node);

  if (status === "cancelled") {
    // Canceled orders do not have PreviousFields; FinalFields
    // have positive values
    return parseCurrencyAmount(node.finalFields[type] as IssuedCurrencyAmount);
  } else if (status === "created") {
    return parseCurrencyAmount(node.newFields[type] as IssuedCurrencyAmount);
  }
  const finalAmount = parseCurrencyAmount(node.finalFields[type] as IssuedCurrencyAmount) as IssuedCurrencyAmount;
  const previousAmount = parseCurrencyAmount(node.previousFields[type] as IssuedCurrencyAmount) as IssuedCurrencyAmount;
  const value = calculateDelta(finalAmount, previousAmount);
  return _.assign({}, finalAmount, { value: value });
}

function parseOrderChange(node: NormalizedNode): OfferDescription {
  const takerPays = parseChangeAmount(node, "TakerPays");
  const takerGets = parseChangeAmount(node, "TakerGets");

  const fields = Object.keys(node.finalFields).length > 0 ? node.finalFields : node.newFields;
  const flags = parseOfferFlags(fields.Flags as number);

  const orderChange = removeUndefined({
    flags,
    takerGets,
    takerPays,
    sequence: fields.Sequence as number,
    status: parseOrderStatus(node),
    makerExchangeRate: getQuality(node),
    expirationTime: getExpirationTime(node),
    domainID: fields.DomainID as string,

    // eslint-disable-next-line no-bitwise
    direction: ((node.finalFields.Flags as any) & LedgerEntry.OfferFlags.lsfSell) === 0 ? "buy" : "sell", // @deprecated
    quantity: flags.sell === true ? takerGets : takerPays, // @deprecated
    totalPrice: flags.sell === true ? takerPays : takerGets, // @deprecated
  });

  // make sure address does not show up in the final object
  Object.defineProperty(orderChange, "account", {
    value: fields.Account,
  });

  return orderChange;
}

function groupByAddress(orderChanges: OfferDescription[]): Orderbook {
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
function parseOrderbookChanges(metadata: TransactionMetadata): Orderbook {
  const affectedNodes = metadata.AffectedNodes.filter((affectedNode: any) => {
    const node = affectedNode.CreatedNode || affectedNode.ModifiedNode || affectedNode.DeletedNode;
    return node.LedgerEntryType === "Offer";
  });

  const orderChanges = affectedNodes.map((affectedNode: any) => {
    const normalizedNode = normalizeNode(affectedNode);
    return parseOrderChange(normalizedNode);
  });

  return groupByAddress(orderChanges);
}

export { parseOrderbookChanges };
