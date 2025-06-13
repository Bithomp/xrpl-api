import _ from "lodash";
import { AccountOffer } from "xrpl";
import * as Client from "../client";
import { LedgerIndex } from "../models/ledger";
import { AccountOffers } from "../models/account_offers";
import { parseMarker, createMarker } from "../common/utils";
import { ErrorResponse } from "../models/base_model";
import { FormattedAccountOrders, FormattedAccountOrder, parseAccountOrder } from "../parse/ledger/account-order";
import { removeUndefined } from "../common";

const OFFERS_LIMIT_MAX = 400;

export interface GetAccountOffers {
  ledgerIndex?: LedgerIndex;
  limit?: number;
  marker?: any;
  legacy?: boolean; // @deprecated, use formatted
  formatted?: boolean; // returns response in old old format data, same as legacy
}

/**
 * @returns {Promise<object | ErrorResponse>} like
 * {
 *   account: "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z",
 *   ledger_hash: "BD24686C403D2FB1B1C38C56BF0A672C4073B0376F842EDD59BA0937FD68BABC",
 *   ledger_index: 70215272,
 *   offers: [
 *     {
 *       flags: 131072,
 *       quality: "1000",
 *       seq: 290,
 *       taker_gets: { currency: "BTH", issuer: "rBithomp3UNknnjo8HKNfyS5MN4kdPTZpW", value: "499.9328329801284" },
 *       taker_pays: { currency: "USD", issuer: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B", value: "499932.8329801284" },
 *     },
 *   ],
 *   validated: true,
 * }
 * @exception {Error}
 */
export async function getAccountOffers(
  account: string,
  options: GetAccountOffers = {}
): Promise<AccountOffers | FormattedAccountOrders | ErrorResponse> {
  const formatted = options.legacy === true || options.formatted === true;
  const { hash, marker } = parseMarker(options.marker);
  options.marker = marker;
  const connection: any = Client.findConnection(undefined, undefined, undefined, hash);
  if (!connection) {
    throw new Error("There is no connection");
  }

  const response = await connection.request({
    command: "account_offers",
    account,
    ledger_index: options.ledgerIndex || "validated",
    limit: options.limit,
    marker: options.marker,
  });

  if (!response) {
    return {
      account,
      status: "error",
      error: "invalidResponse",
    };
  }

  if (response.error) {
    const { error, error_code, error_message, error_exception, status, validated } = response;

    return removeUndefined({
      account,
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

  if (formatted === true) {
    result.offers = formatResponse(account, result.offers);
  }

  return result;
}

export async function getAccountAllOffers(
  account: string,
  options: GetAccountOffers = {}
): Promise<AccountOffers | FormattedAccountOrders | ErrorResponse> {
  const limit = options.limit;
  let response: any;
  const accountOffers: AccountOffers[] = [];

  // download all objects with marker
  while (true) {
    if (options.limit && limit) {
      const left = limit - accountOffers.length;
      const parts = Math.floor(left / OFFERS_LIMIT_MAX);
      if (parts === 0) {
        options.limit = left;
      } else {
        options.limit = left;
      }
    }

    response = await getAccountOffers(account, options);
    if (response.error) {
      return response;
    }

    accountOffers.push(...response.offers);
    if (limit && accountOffers.length >= limit) {
      response.limit = accountOffers.length; // override last limit with total one
      break;
    }

    if (response.marker) {
      options.marker = response.marker;
    } else {
      break;
    }
  }

  if (response.error) {
    const { error, error_code, error_message, error_exception, status, validated } = response;

    return removeUndefined({
      account,
      error,
      error_code,
      error_message,
      error_exception,
      status,
      validated,
    });
  }

  response.offers = accountOffers;

  return response;
}

function formatResponse(address: string, offers: AccountOffer[]): FormattedAccountOrder[] {
  const orders = offers.map((offer) => {
    return parseAccountOrder(address, offer);
  });

  return _.sortBy(orders, (order) => order.properties.sequence);
}
