import * as Client from "../client";
import { Connection } from "../connection";
import { LedgerIndex } from "../models/ledger";
import { ErrorResponse } from "../models/base_model";

export interface GetManifestOptions {
  ledgerIndex?: LedgerIndex;
  connection?: Connection;
}

/**
 * @returns {Promise<object | ErrorResponse>}
 * @exception {Error}
 */
export async function getManifest(
  publicKey: string,
  options: GetManifestOptions = {}
): Promise<object | ErrorResponse> {
  const connection: any = options.connection || Client.findConnection("manifest");
  if (!connection) {
    throw new Error("There is no connection");
  }

  const response: any = await connection.request({
    command: "manifest",
    public_key: publicKey,
  });

  if (!response) {
    return {
      public_key: publicKey,
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
