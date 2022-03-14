import * as Client from "../client";
import { LedgerIndex } from "../models/ledger_index";
import { TakerAmount, OrderbookInfo, formatBidsAndAsks } from "../models/book_offers";

export interface GetGetBookOffers {
  ledgerIndex?: LedgerIndex;
  limit?: number;
}

/**
 * @returns {Promise<object | null>} like
 * @exception {Error}
 */
export async function getBookOffers(
  taker: string,
  takerGets: TakerAmount,
  takerPays: TakerAmount,
  options: GetGetBookOffers = {}
): Promise<object | null> {
  const connection: any = Client.findConnection();
  if (!connection) {
    throw new Error("There is no connection");
  }

  await connection.connect();
  const response = await connection.request({
    command: "book_offers",
    taker,
    taker_gets: takerGets,
    taker_pays: takerPays,
    ledger_index: options.ledgerIndex || "validated",
    limit: options.limit,
  });

  if (!response) {
    return null;
  }

  if (response.error) {
    const { error, error_code, error_message, status, validated } = response;

    return {
      taker,
      error,
      error_code,
      error_message,
      status,
      validated,
    };
  }

  return response?.result;
}

function convertIssueToTakerAmount<T>(obj: T & { counterparty?: string; issuer?: string }): T & { issuer?: string } {
  const issuer = obj.counterparty != null ? obj.counterparty : obj.issuer != null ? obj.issuer : undefined;
  const withIssuer = Object.assign({}, obj, { issuer });
  delete withIssuer.counterparty;

  return withIssuer;
}

export async function getOrderbook(
  taker: string,
  orderbook: OrderbookInfo,
  options: GetGetBookOffers = {}
): Promise<object | null> {
  getBookOffers;

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

  return formatBidsAndAsks(orderbook, [...(directOfferResults as any).offers, ...(reverseOfferResults as any).offers]);
}
