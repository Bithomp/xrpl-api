import * as Client from "../client";
import { Connection } from "../connection";
import { LedgerIndex } from "../models/ledger";
import { URITokenInterface } from "../models/account_uritokens";
import { ErrorResponse } from "../models/base_model";
import { removeUndefined } from "../common";

const LEDGER_ENTRY_AMENDMENTS = "7DB0788C020F02780A673DC74757F23823FA3014C1866E72CC4CD8B226CD6EF4";
// const LEDGER_ENTRY_NEGATIVE_UNL = "2E8A59AA9D3B5B186B0B9E0F62E6C02587CA74A4D778938E957B6357D364B244";
// const LEDGER_ENTRY_FEE_SETTINGS = "4BC50C9B0D8515D3EAAE1E74B29A95804346C491EE1A95BF25E4AAB854A6A651";
// const LEDGER_ENTRY_LEDGER_HASHES = "B4979A36CDC7F3D3D5C31A4EAE2AC7D7209DDA877588B9AFC66799692AB0D66B";
// const LEDGER_ENTRY_UNL_REPORT = "61E32E7A24A238F1C619D5F9DDCC41A94B33B66C0163F7EFCC8A19C9FD6F28DC";

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
