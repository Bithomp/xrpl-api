import * as Client from "../client";
import { LedgerIndex } from "../models/ledger";
import { parseMarker, createMarker } from "../common/utils";
import { AccountLinesResponse } from "../models/account_lines";
import { ErrorResponse } from "../models/base_model";
import { removeUndefined } from "../common";

export interface GetAccountLinesOptions {
  issuer?: string;
  currency?: string;
  ledgerIndex?: LedgerIndex;
  limit?: number;
  marker?: any;
}

/**
 * @returns {Promise<AccountLinesResponse | ErrorResponse>} like
 * {
 *   account: "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z",
 *   ledger_hash: "BD24686C403D2FB1B1C38C56BF0A672C4073B0376F842EDD59BA0937FD68BABC",
 *   ledger_index: 70215272,
 *   lines: [
 *     {
 *       account: "rNTvdxPWujQn2sUXYBGxmWrGe4ethkLyhb",
 *       balance: "123.45",
 *       currency: "FOO",
 *       limit: "1000000000",
 *       limit_peer: "0",
 *       no_ripple: false,
 *       no_ripple_peer: false,
 *       quality_in: 0,
 *       quality_out: 0,
 *     },
 *   ]
 *   validated: true,
 * }
 * @exception {Error}
 */
export async function getAccountLines(
  account: string,
  options: GetAccountLinesOptions = {}
): Promise<AccountLinesResponse | ErrorResponse> {
  const { hash, marker } = parseMarker(options.marker);
  options.marker = marker;
  const connection: any = Client.findConnection(undefined, undefined, undefined, hash);
  if (!connection) {
    throw new Error("There is no connection");
  }

  const response = await connection.request({
    command: "account_lines",
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

  // filter out lines with the same currency and issuer
  if (options.currency || options.issuer) {
    result.lines = result.lines.filter((line: any) => {
      if (options.currency && line.currency !== options.currency) {
        return false;
      }
      if (options.issuer && line.account !== options.issuer) {
        return false;
      }
      return true;
    });
  }

  const newMarker = createMarker(connection.hash, result.marker);
  if (newMarker) {
    result.marker = newMarker;
  }

  return result;
}
