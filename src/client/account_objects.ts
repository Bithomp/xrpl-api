import { LedgerEntry } from "xrpl";
import * as Client from "../client";

import { Trustline } from "../models/trustline";
import { AccountObject, AccountObjectType } from "../models/account_object";
import { LedgerIndex } from "../models/ledger_index";

const { RippleStateFlags } = LedgerEntry;

export interface GetAccountObjectsOptions {
  type?: AccountObjectType;
  ledgerHash?: string;
  ledgerIndex?: LedgerIndex;
  limit?: number;
  marker?: string;
}

/**
 * @returns {Promise<object[] | object | null>} like
 * [
 *   {
 *     "Balance": {
 *       "currency": "FOO",
 *       "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
 *       "value": "-123.45"
 *     },
 *     "Flags": 131072,
 *     "HighLimit": {
 *       "currency": "FOO",
 *       "issuer": "rLRUyXNh6QNmkdR1xJrnJBGURQeNp9Ltyf",
 *       "value": "1000000000"
 *     },
 *     "HighNode": "0",
 *     "LedgerEntryType": "RippleState",
 *     "LowLimit": {
 *       "currency": "FOO",
 *       "issuer": "rNTvdxPWujQn2sUXYBGxmWrGe4ethkLyhb",
 *       "value": "0"
 *     },
 *     "LowNode": "0",
 *     "PreviousTxnID": "682BC63E6B3A17304301D921383516F4EF5F4A521B170EAF8492486B21D638FD",
 *     "PreviousTxnLgrSeq": 22442930,
 *     "index": "7A130F5FC6D937B65545220DC483B918A4A137D918EF2F126ECD4CBBFE44A633"
 *   }
 * ]
 * @exception {Error}
 */
export async function getAccountObjects(
  account: string,
  options: GetAccountObjectsOptions = {}
): Promise<object[] | object | null> {
  const connection: any = Client.findConnection();
  if (!connection) {
    throw new Error("There is no connection");
  }

  await connection.connect();
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

  return response?.result?.account_objects;
}

export interface GetAccountLinesObjectsOptions {
  ledgerHash?: string;
  ledgerIndex?: LedgerIndex;
}

/**
 * @returns {Promise<object[] | object | null>}
 * @exception {Error}
 */
export async function getAccountLinesObjectsAsync(
  account: string,
  options: GetAccountLinesObjectsOptions = {}
): Promise<object[] | object | null> {
  const connection: any = Client.findConnection();
  if (!connection) {
    throw new Error("There is no connection");
  }

  await connection.connect();
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

  const accountObjects = response?.result?.account_objects;
  if (!accountObjects) {
    return accountObjects;
  }

  return accountObjectsToAccountLines(account, accountObjects, false);
}

/**
 * https://gist.github.com/WietseWind/5df413334385367c548a148de3d8a713
 *
 * This function returns account_lines line results
 * based on account_objects (type = state) results,
 * » Returns only the account_lines to show based on:
 *   - Counts towards your reserve
 */
export function accountObjectsToAccountLines(
  account: string,
  accountObjects: AccountObject[],
  suppressIncoming: boolean
) {
  const notInDefaultState = accountObjects.filter((obj: any) => {
    return (
      obj.HighLimit &&
      obj.LowLimit &&
      // tslint:disable-next-line:no-bitwise
      obj.Flags & RippleStateFlags[obj.HighLimit.issuer === account ? "lsfHighReserve" : "lsfLowReserve"]
    );
  });

  const accountLinesFormatted: Trustline[] = notInDefaultState.map((obj: any) => {
    const parties = [obj.HighLimit, obj.LowLimit];
    const [self, counterparty] = obj.HighLimit.issuer === account ? parties : parties.reverse();

    const ripplingFlags = [
      // tslint:disable-next-line:no-bitwise
      (RippleStateFlags.lsfHighNoRipple & obj.Flags) === RippleStateFlags.lsfHighNoRipple,
      // tslint:disable-next-line:no-bitwise
      (RippleStateFlags.lsfLowNoRipple & obj.Flags) === RippleStateFlags.lsfLowNoRipple,
    ];
    // tslint:disable-next-line:variable-name
    const [no_ripple, no_ripple_peer] = obj.HighLimit.issuer === account ? ripplingFlags : ripplingFlags.reverse();

    const balance = obj.Balance.value === "0" ? obj.Balance.value : obj.Balance.value.slice(1);

    return {
      account: counterparty.issuer,
      balance,
      currency: self.currency,
      limit: self.value,
      limit_peer: counterparty.value,
      no_ripple,
      no_ripple_peer,
    } as Trustline;
  });

  return accountLinesFormatted.filter((line: Trustline) => {
    if (suppressIncoming) {
      if (line.limit === "0" && (line.balance === "0" || line.balance.slice(0, 1) === "-")) {
        return false;
      }
    }
    return true;
  });
}
