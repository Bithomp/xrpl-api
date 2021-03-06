import * as Client from "../client";
import { LedgerIndex } from "../models/ledger";

export interface GetAccountOffers {
  ledgerIndex?: LedgerIndex;
  limit?: number;
}

/**
 * @returns {Promise<object | null>} like
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
export async function getAccountOffers(account: string, options: GetAccountOffers = {}): Promise<object | null> {
  const connection: any = Client.findConnection();
  if (!connection) {
    throw new Error("There is no connection");
  }

  const response = await connection.request({
    command: "account_offers",
    account,
    ledger_index: options.ledgerIndex || "validated",
    limit: options.limit,
  });

  if (!response) {
    return null;
  }

  if (response.error) {
    const { error, error_code, error_message, status, validated } = response;

    return {
      account,
      error,
      error_code,
      error_message,
      status,
      validated,
    };
  }

  return response?.result;
}
