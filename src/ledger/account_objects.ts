import * as Client from "../client";

import { AccountObjectType, accountObjectsToAccountLines, accountObjectsToNFTOffers } from "../models/account_object";
import { LedgerIndex } from "../models/ledger";

const OBJECTS_LIMIT_MAX = 400;

export interface GetAccountObjectsOptions {
  type?: AccountObjectType;
  ledgerHash?: string;
  ledgerIndex?: LedgerIndex;
  limit?: number; // The maximum number of objects to include in the results. Must be within the inclusive range 10 to 400 on non-admin connections. The default is 200.P
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

export interface GetAccountAllObjectsOptions extends GetAccountObjectsOptions {
  timeout?: number;
}

export async function getAccountAllObjects(
  account: string,
  options: GetAccountAllObjectsOptions = {}
): Promise<object | null> {
  const connection: any = Client.findConnection();
  if (!connection) {
    throw new Error("There is no connection");
  }

  const timeStart = new Date();
  const limit = options.limit;
  let response: any;
  let accountObjects: any[] = [];

  // donwload all objects with marker
  while (true) {
    const currentTime = new Date();
    // timeout validation
    if (options.timeout && currentTime.getTime() - timeStart.getTime() > options.timeout) {
      options.timeout = currentTime.getTime() - timeStart.getTime();
      break;
    }

    if (options.limit && limit) {
      const left = limit - accountObjects.length;
      const parts = Math.floor(left / OBJECTS_LIMIT_MAX);
      if (parts === 0) {
        options.limit = left;
      } else {
        options.limit = left - 10; // we should leave 10 objects for the next request
      }
    }

    response = await getAccountObjects(account, options);
    if (!response || response.error) {
      return response;
    }

    accountObjects.push(...response.account_objects);
    if (limit && accountObjects.length >= limit) {
      response.limit = accountObjects.length; // override last limit with total one
      break;
    }

    if (response.marker) {
      options.marker = response.marker;
    } else {
      break;
    }
  }

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

  response.account_objects = accountObjects;

  return response;
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

  const response: any = await getAccountAllObjects(account, {
    type: "state",
    ledgerHash: options.ledgerHash,
    ledgerIndex: options.ledgerIndex,
  });

  if (!response) {
    return null;
  }

  if (response.error) {
    return response;
  }

  const accountObjects = response.account_objects;

  const accountLines = accountObjectsToAccountLines(account, accountObjects);
  delete response.account_objects;
  response.lines = accountLines;

  return response;
}

export interface GetAccountNFTOffersObjectsOptions {
  ledgerHash?: string;
  ledgerIndex?: LedgerIndex;
}

/**
 * @param account
 * @param options
 * @returns {Promise<object | null>}
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
): Promise<object | null> {
  const connection: any = Client.findConnection();
  if (!connection) {
    throw new Error("There is no connection");
  }

  const response: any = await getAccountAllObjects(account, {
    type: "nft_offer",
    ledgerHash: options.ledgerHash,
    ledgerIndex: options.ledgerIndex,
  });

  if (!response) {
    return null;
  }

  if (response.error) {
    return response;
  }

  const accountObjects = response.account_objects;
  response.nft_offers = accountObjectsToNFTOffers(accountObjects);
  delete response.account_objects;

  return response;
}
