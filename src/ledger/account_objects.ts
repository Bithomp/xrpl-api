import * as Client from "../client";

import { AccountObjectType, accountObjectsToAccountLines } from "../models/account_object";
import { LedgerIndex } from "../models/ledger";

export interface GetAccountObjectsOptions {
  type?: AccountObjectType;
  ledgerHash?: string;
  ledgerIndex?: LedgerIndex;
  limit?: number;
  marker?: string;
}

/**
 * @returns {Promise<object | null>} like
 * {
 *   "account": "rLRUyXNh6QNmkdR1xJrnJBGURQeNp9Ltyf",
 *   "account_objects": [
 *     {
 *       "Balance": {
 *         "currency": "FOO",
 *         "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
 *         "value": "-123.45"
 *       },
 *       "Flags": 131072,
 *       "HighLimit": {
 *         "currency": "FOO",
 *         "issuer": "rLRUyXNh6QNmkdR1xJrnJBGURQeNp9Ltyf",
 *         "value": "1000000000"
 *       },
 *       "HighNode": "0",
 *       "LedgerEntryType": "RippleState",
 *       "LowLimit": {
 *         "currency": "FOO",
 *         "issuer": "rNTvdxPWujQn2sUXYBGxmWrGe4ethkLyhb",
 *         "value": "0"
 *       },
 *       "LowNode": "0",
 *       "PreviousTxnID": "682BC63E6B3A17304301D921383516F4EF5F4A521B170EAF8492486B21D638FD",
 *       "PreviousTxnLgrSeq": 22442930,
 *       "index": "7A130F5FC6D937B65545220DC483B918A4A137D918EF2F126ECD4CBBFE44A633"
 *     }
 *   ],
 *   "ledger_hash": "CC9F48CDEAB2573932979BD27AF32A7AE8921C068D6AC325A96D69E06BF2DA6E",
 *   "ledger_index": 27019921,
 *   "validated": true
 * }
 * @exception {Error}
 */
export async function getAccountObjects(
  account: string,
  options: GetAccountObjectsOptions = {}
): Promise<object | null> {
  const connection: any = Client.findConnection();
  if (!connection) {
    throw new Error("There is no connection");
  }

  const response = await connection.request({
    command: "account_objects",
    account,
    type: options.type,
    ledger_hash: options.ledgerHash,
    ledger_index: options.ledgerIndex || "validated",
    limit: options.limit,
    marker: options.marker,
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

export interface GetAccountLinesObjectsOptions {
  ledgerHash?: string;
  ledgerIndex?: LedgerIndex;
}

/**
 * @returns {Promise<object | null>}
 * {
 *   "account": "rLRUyXNh6QNmkdR1xJrnJBGURQeNp9Ltyf",
 *   "ledger_hash": "E72945940A2DB38FB20F1C385C00C465F68545761BD6D29ECF8671D2FC539B57",
 *   "ledger_index": 27020140,
 *   "validated": true,
 *   "lines": [
 *     {
 *       "account": "rNTvdxPWujQn2sUXYBGxmWrGe4ethkLyhb",
 *       "balance": "123.45",
 *       "currency": "FOO",
 *       "limit": "1000000000",
 *       "limit_peer": "0",
 *       "no_ripple": false,
 *       "no_ripple_peer": false
 *     }
 *   ]
 * }
 * @exception {Error}
 */
export async function getAccountLinesObjects(
  account: string,
  options: GetAccountLinesObjectsOptions = {}
): Promise<object | null> {
  const connection: any = Client.findConnection();
  if (!connection) {
    throw new Error("There is no connection");
  }

  const response = await connection.request({
    command: "account_objects",
    account,
    type: "state",
    ledger_hash: options.ledgerHash,
    ledger_index: options.ledgerIndex || "validated",
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

  const result = response?.result;
  const accountObjects = result?.account_objects;

  const accountLines = accountObjectsToAccountLines(account, accountObjects);
  delete result.account_objects;
  result.lines = accountLines;

  return result;
}
