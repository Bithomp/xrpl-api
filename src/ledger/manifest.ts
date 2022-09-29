import * as Client from "../client";
import { Connection } from "../connection";
import { LedgerIndex } from "../models/ledger";

export interface GetManifestOptions {
  ledgerIndex?: LedgerIndex;
  connection?: Connection;
}

/**
 * @returns {string | null}
 * @exception {Error}
 */
export async function getManifest(publicKey: string, options: GetManifestOptions = {}): Promise<object | null> {
  const connection: any = options.connection || Client.findConnection("manifest");
  if (!connection) {
    throw new Error("There is no connection");
  }

  const response: any = await connection.request({
    command: "manifest",
    public_key: publicKey,
  });

  if (!response) {
    return null;
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
