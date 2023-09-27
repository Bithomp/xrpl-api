import * as Client from "../client";
import { Connection } from "../connection";
import { LedgerIndex } from "../models/ledger";
import { URITokenInterface } from "../models/account_uri_tokens";
import { ErrorResponse } from "../models/base_model";
import { removeUndefined } from "../common";

const LEDGER_ENTRY_AMENDMENTS = "7DB0788C020F02780A673DC74757F23823FA3014C1866E72CC4CD8B226CD6EF4";

export interface GetLedgerEntryOptions {
  ledgerIndex?: LedgerIndex;
  connection?: Connection;
}

export async function getLedgerEntry(
  ledgerEntry: string,
  options: GetLedgerEntryOptions = {}
): Promise<any | ErrorResponse> {
  const connection = options.connection || Client.findConnection();
  if (!connection) {
    throw new Error("There is no connection");
  }

  const response = await connection.request({
    command: "ledger_entry",
    index: ledgerEntry,
    ledger_index: options.ledgerIndex || "validated",
  });

  if (!response) {
    return {
      ledger_entry: ledgerEntry,
      status: "error",
      error: "invalidResponse",
    };
  }

  if (response.error) {
    const { error, error_code, error_message, status, validated } = response;

    return {
      ledger_entry: ledgerEntry,
      error,
      error_code,
      error_message,
      status,
      validated,
    };
  }

  return response?.result;
}

export async function getLedgerEntryAmendments(options: GetLedgerEntryOptions = {}): Promise<any | ErrorResponse> {
  const response = await getLedgerEntry(LEDGER_ENTRY_AMENDMENTS, options);
  if (!response || !response.node) {
    return {
      status: "error",
      error: "invalidResponse",
    };
  }

  if (response.error) {
    return response;
  }

  return response?.node;
}

// NOTE: URI Tokens is not part of mainnet, this code can be changed in the future without notice
export async function getLedgerEntryURIToken(
  uriTokenID: string,
  options: GetLedgerEntryOptions = {}
): Promise<URITokenInterface | ErrorResponse> {
  const response = await getLedgerEntry(uriTokenID, options);
  if (!response || !response.node) {
    return {
      status: "error",
      error: "invalidResponse",
    };
  }

  if (response.error) {
    return response;
  }

  if (response.node.LedgerEntryType !== "URIToken") {
    return {
      status: "error",
      error: "invalidLedgerEntry",
    };
  }

  return removeUndefined({
    Digest: response.node.Digest,
    Flags: response.node.Flags,
    Issuer: response.node.Issuer,
    Owner: response.node.Owner,
    URITokenID: response.node.index,
    URI: response.node.URI,
    Amount: response.node.Amount,
    Destination: response.node.Destination,
  });
}
