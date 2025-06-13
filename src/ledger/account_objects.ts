import { AccountObjectsRequest } from "xrpl";

import * as Client from "../client";
import { Connection } from "../connection";

import {
  AccountObjectType,
  accountObjectsToAccountLines,
  accountObjectsToNFTOffers,
  AccountObjects,
  AccountNFTObjectsResponse,
  accountObjectsToURITokens,
  AccountURITokensObjectsResponse,
} from "../models/account_object";
import { AccountLinesResponse } from "../models/account_lines";
import { ErrorResponse } from "../models/base_model";
import { LedgerIndex } from "../models/ledger";
import { parseMarker, createMarker, removeUndefined } from "../common/utils";

const OBJECTS_LIMIT_DEFAULT = 200;
const OBJECTS_LIMIT_MAX = 400;
const OBJECTS_LIMIT_MIN = 10;

export interface GetAccountObjectsOptions {
  type?: AccountObjectType;
  ledgerHash?: string;
  ledgerIndex?: LedgerIndex;
  limit?: number; // The maximum number of objects to include in the results. Must be within the inclusive range 10 to 400 on non-admin connections. The default is 200.P
  marker?: string;
  connection?: Connection;
}

/**
 * @returns {Promise<AccountObjects | ErrorResponse>} like
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
): Promise<AccountObjects | ErrorResponse> {
  const { hash, marker } = parseMarker(options.marker);
  options.marker = marker;
  const connection: any = options.connection || Client.findConnection("account_objects", undefined, undefined, hash);
  if (!connection) {
    throw new Error("There is no connection");
  }

  const request: AccountObjectsRequest = {
    command: "account_objects",
    account,
    type: options.type as any, // xrpl.js does not know about xahau types
    ledger_hash: options.ledgerHash,
    ledger_index: options.ledgerIndex || "validated",
    limit: options.limit || OBJECTS_LIMIT_DEFAULT,
    marker: options.marker,
  };

  const response = await connection.request(request);

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

  return result;
}

export interface GetAccountAllObjectsOptions extends GetAccountObjectsOptions {
  timeout?: number;
}

export async function getAccountAllObjects(
  account: string,
  options: GetAccountAllObjectsOptions = {}
): Promise<AccountObjects | ErrorResponse> {
  // create new object to prevent mutation of the original one
  const loadOptions = { ...options };

  // NOTE: set default connection, to make sure we have loaded all objects from the same server,
  // otherwise it can fail with marker malformed
  loadOptions.connection =
    loadOptions.connection || (Client.findConnection("account_objects", undefined, undefined) as Connection);

  const timeStart = new Date();
  const limit = loadOptions.limit;
  let response: any;
  const accountObjects: AccountObjects[] = [];

  // download all objects with marker
  while (true) {
    const currentTime = new Date();
    // timeout validation
    if (loadOptions.timeout && currentTime.getTime() - timeStart.getTime() > loadOptions.timeout) {
      loadOptions.timeout = currentTime.getTime() - timeStart.getTime();
      break;
    }

    if (loadOptions.limit && limit) {
      const left = limit - accountObjects.length;
      const parts = Math.floor(left / OBJECTS_LIMIT_MAX);
      if (parts === 0) {
        loadOptions.limit = left;
      } else {
        loadOptions.limit = left - OBJECTS_LIMIT_MIN; // we should leave 10 objects for the next request
      }
    }

    response = await getAccountObjects(account, loadOptions);
    if (response.error) {
      return response;
    }

    accountObjects.push(...response.account_objects);
    if (limit && accountObjects.length >= limit) {
      response.limit = accountObjects.length; // override last limit with total one
      break;
    }

    if (response.marker) {
      loadOptions.marker = response.marker;
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

  response.account_objects = accountObjects;

  if (!options.hasOwnProperty("limit") || options.limit === undefined) {
    // remove limit if it was not set, since it can be omitted from the server response
    delete response.limit;
  }

  return response;
}

export interface GetAccountLinesObjectsOptions {
  ledgerHash?: string;
  ledgerIndex?: LedgerIndex;
}

/**
 * @returns {Promise<AccountLinesResponse | ErrorResponse>}
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
): Promise<AccountLinesResponse | ErrorResponse> {
  const response = await getAccountAllObjects(account, {
    type: "state",
    ledgerHash: options.ledgerHash,
    ledgerIndex: options.ledgerIndex,
  });

  if ("error" in response) {
    return response;
  }

  const accountObjects = response.account_objects;
  const accountLines = accountObjectsToAccountLines(account, accountObjects);

  return {
    account: response.account,
    ledger_hash: response.ledger_hash,
    ledger_index: response.ledger_index,
    validated: response.validated,
    lines: accountLines,
  };
}

export interface GetAccountNFTOffersObjectsOptions {
  ledgerHash?: string;
  ledgerIndex?: LedgerIndex;
  limit?: number; // The maximum number of objects to include in the results. Must be within the inclusive range 10 to 400 on non-admin connections. The default is 200.P
  marker?: string;
}

/**
 * @param account
 * @param options
 * @returns {Promise<AccountNFTObjectsResponse | ErrorResponse>}
 * {
 *   "account": "rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw",
 *   "ledger_hash": "3E1198BF849E2A2ABB8667DA275F180FB48CA02408FE3ABE0F94CBC5145FA773",
 *   "ledger_index": 7197353,
 *   "validated": true,
 *   "nft_offers": [
 *     {
 *       "nft_id": "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF16E5DA9C00000001",
 *       "amount": "1",
 *       "flags": 0,
 *       "index": "F5BC0A6FD7DFA22A92CD44DE7F548760D855C35755857D1AAFD41CA3CA57CA3A",
 *       "owner": "rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw"
 *     }
 *   ]
 * }
 */
export async function getAccountNFTOffersObjects(
  account: string,
  options: GetAccountNFTOffersObjectsOptions = {}
): Promise<AccountNFTObjectsResponse | ErrorResponse> {
  const response = await getAccountAllObjects(account, {
    type: "nft_offer",
    ledgerHash: options.ledgerHash,
    ledgerIndex: options.ledgerIndex,
    limit: options.limit,
    marker: options.marker,
  });

  if ("error" in response) {
    return response;
  }

  const accountObjects = response.account_objects;
  const nftOffers = accountObjectsToNFTOffers(accountObjects);

  return {
    account: response.account,
    ledger_hash: response.ledger_hash,
    ledger_index: response.ledger_index,
    validated: response.validated,
    nft_offers: nftOffers,
  };
}

export interface GetAccountDepositPreauthObjectsOptions {
  ledgerHash?: string;
  ledgerIndex?: LedgerIndex;
  limit?: number; // The maximum number of objects to include in the results. Must be within the inclusive range 10 to 400 on non-admin connections. The default is 200.P
  marker?: string;
}

export async function getAccountDepositPreauthObjects(
  account: string,
  options: GetAccountDepositPreauthObjectsOptions = {}
): Promise<any | ErrorResponse> {
  const response = await getAccountAllObjects(account, {
    type: "deposit_preauth",
    ledgerHash: options.ledgerHash,
    ledgerIndex: options.ledgerIndex,
    limit: options.limit,
    marker: options.marker,
  });

  if ("error" in response) {
    return response;
  }

  return response;
}

// NOTE: URI Tokens is not part of mainnet, this code can be changed in the future without notice
export interface GetAccountURITokensObjectsOptions {
  ledgerHash?: string;
  ledgerIndex?: LedgerIndex;
  limit?: number; // The maximum number of objects to include in the results. Must be within the inclusive range 10 to 400 on non-admin connections. The default is 200.P
  marker?: string;
}

// NOTE: URI Tokens is not part of mainnet, this code can be changed in the future without notice
export async function getAccountURITokensObjects(
  account: string,
  options: GetAccountURITokensObjectsOptions = {}
): Promise<AccountURITokensObjectsResponse | ErrorResponse> {
  const response = await getAccountAllObjects(account, {
    type: "uri_token",
    ledgerHash: options.ledgerHash,
    ledgerIndex: options.ledgerIndex,
    limit: options.limit,
    marker: options.marker,
  });

  if ("error" in response) {
    return response;
  }

  const accountObjects = response.account_objects;
  const uritokens = accountObjectsToURITokens(accountObjects);

  return {
    account: response.account,
    ledger_hash: response.ledger_hash,
    ledger_index: response.ledger_index,
    validated: response.validated,
    uritokens: uritokens,
  };
}
