import * as Client from "../client";
import { Connection } from "../connection";
import { ErrorResponse } from "../models/base_model";
import { IssuedCurrency } from "../types";
import { LedgerIndex } from "../models/ledger";

export interface GetAmmInfoOptions {
  url?: string;
  type?: string;
  connection?: Connection;
  ledgerIndex?: LedgerIndex;
  account?: string;
}

/**
 * @returns {Promise<object | ErrorResponse>}
 * @exception {Error}
 */
export async function getAmmInfo(ammAccount: string, options: GetAmmInfoOptions = {}): Promise<object | ErrorResponse> {
  const connection: any = options.connection || Client.findConnection(options.type, options.url, true);
  if (!connection) {
    throw new Error("There is no connection");
  }

  if (!ammAccount) {
    return {
      error: "invalidParams",
      error_code: 31,
      error_message: "Invalid parameters.",
    };
  }

  const response: any = await connection.request({
    command: "amm_info",
    ledger_index: options.ledgerIndex || "validated",
    account: options.account,
    amm_account: ammAccount,
  });

  if (!response) {
    return {
      status: "error",
      error: "invalidResponse",
    };
  }

  if (response.error) {
    const { error, error_code, error_message, status, validated } = response;

    return {
      error,
      error_code,
      error_message,
      status,
      validated,
    };
  }

  return response?.result;
}

export async function getAmmInfoByAssets(
  asset: string | IssuedCurrency,
  asset2: string | IssuedCurrency,
  options: GetAmmInfoOptions = {}
): Promise<object | ErrorResponse> {
  const connection: any = options.connection || Client.findConnection(options.type, options.url, true);
  if (!connection) {
    throw new Error("There is no connection");
  }

  if (!asset || !asset2) {
    return {
      error: "invalidParams",
      error_code: 31,
      error_message: "Invalid parameters.",
    };
  }

  const response: any = await connection.request({
    command: "amm_info",
    ledger_index: options.ledgerIndex || "validated",
    account: options.account,
    asset: asset,
    asset2: asset2,
  });

  if (!response) {
    return {
      status: "error",
      error: "invalidResponse",
    };
  }

  if (response.error) {
    const { error, error_code, error_message, status, validated } = response;

    return {
      error,
      error_code,
      error_message,
      status,
      validated,
    };
  }

  return response?.result;
}
