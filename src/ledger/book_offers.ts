import * as Client from "../client";
import { LedgerIndex } from "../models/ledger";
import { OrderbookInfo, formatBidsAndAsks } from "../models/book_offers";
import { IssuedCurrency } from "../types";
import { parseMarker, createMarker } from "../common/utils";
import { ErrorResponse } from "../models/base_model";
import { removeUndefined } from "../common";

export interface GetGetBookOffersOptions {
  ledgerIndex?: LedgerIndex;
  limit?: number;
  marker?: any;
}

/**
 * @returns {Promise<object | ErrorResponse>} like
 * @exception {Error}
 */
export async function getBookOffers(
  taker: string,
  takerGets: IssuedCurrency,
  takerPays: IssuedCurrency,
  options: GetGetBookOffersOptions = {}
): Promise<object | ErrorResponse> {
  const { hash, marker } = parseMarker(options.marker);
  options.marker = marker;
  const connection: any = Client.findConnection("book_offers", undefined, undefined, hash);
  if (!connection) {
    throw new Error("There is no connection");
  }

  const response = await connection.request({
    command: "book_offers",
    taker,
    taker_gets: takerGets,
    taker_pays: takerPays,
    ledger_index: options.ledgerIndex || "validated",
    limit: options.limit,
    marker: options.marker,
  });

  if (!response) {
    return {
      taker,
      status: "error",
      error: "invalidResponse",
    };
  }

  if (response.error) {
    const { error, error_code, error_message, error_exception, status, validated } = response;

    return removeUndefined({
      taker,
      error,
      error_code,
      error_message,
      error_exception,
      status,
      validated,
    });
  }

  const result = response.result;
  const newMarker = createMarker(connection.hash, result.marker);
  if (newMarker) {
    result.marker = newMarker;
  }

  return result;
}

/**
 * Convert the issue object to the taker amount format
 * @param obj - The issue object support both counterparty and issuer, counterparty is deprecated
 * @returns The taker amount object
 * @throws When the issue object is invalid
 */
function convertIssueToTakerAmount<T>(obj: T & { counterparty?: string; issuer?: string }): T & { issuer?: string } {
  const issuer = obj.counterparty != null ? obj.counterparty : obj.issuer != null ? obj.issuer : undefined; // eslint-disable-line eqeqeq
  const withIssuer = Object.assign({}, obj, { issuer });
  delete withIssuer.counterparty;

  return withIssuer;
}

export interface GetGetOrderBookOptions {
  ledgerIndex?: LedgerIndex;
  limit?: number;
}

export async function getOrderbook(
  taker: string,
  orderbook: OrderbookInfo,
  options: GetGetOrderBookOptions = {}
): Promise<object | ErrorResponse> {
  const [directOfferResults, reverseOfferResults] = await Promise.all([
    getBookOffers(
      taker,
      convertIssueToTakerAmount(orderbook.base),
      convertIssueToTakerAmount(orderbook.counter),
      options
    ),
    getBookOffers(
      taker,
      convertIssueToTakerAmount(orderbook.counter),
      convertIssueToTakerAmount(orderbook.base),
      options
    ),
  ]);

  if ((directOfferResults as any).error) {
    return directOfferResults;
  }

  if ((reverseOfferResults as any).error) {
    return reverseOfferResults;
  }

  return formatBidsAndAsks(orderbook, [...(directOfferResults as any).offers, ...(reverseOfferResults as any).offers]);
}
