import * as Client from "../client";

import _ from "lodash";
import { Trustline } from "../models/account_lines";
import { LedgerIndex } from "../models/ledger";
import BigNumber from "bignumber.js";

export interface GetBalanceSheetOptions {
  ledgerIndex?: LedgerIndex;
  hotwallet?: string;
  strict?: boolean;
}

/**
 * @returns {Promise<object | null>} like
 * {
 *   account: 'rBithomp3UNknnjo8HKNfyS5MN4kdPTZpW',
 *   ledger_hash: 'D99FE8D8E104DD899B73F451DF41FA9A44FBB8B609ED1103DBC9641AC07D40F7',
 *   ledger_index: 70169206,
 *   obligations: { BTH: '9999.999' },
 *   assets: {
 *     rBithomp3UNknnjo8HKNfyS5MN4kdPTZpW: [
 *       {
 *         currency: "BTH",
 *         value: "7999.891134554484",
 *       },
 *     ],
 *     rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B: [
 *       {
 *         currency: "USD",
 *         value: "67.16734409565646",
 *       },
 *     ],
 *   },
 *   validated: true,
 *   _nodepref: 'nonfh'
 * }
 * @exception {Error}
 */
export async function getBalanceSheet(account: string, options: GetBalanceSheetOptions = {}): Promise<object | null> {
  const connection: any = Client.findConnection("gateway_balances");
  if (!connection) {
    throw new Error("There is no connection");
  }

  const response = await connection.request({
    command: "gateway_balances",
    account,
    ledger_index: options.ledgerIndex || "validated",
    hotwallet: options.hotwallet,
    strict: !!options.strict,
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

export interface ObligationTrustline extends Trustline {
  obligation?: boolean;
}

/**
 * @returns {Promise<object | null>} like
 */
export async function getAccountObligations(account: string): Promise<object | null> {
  const response = (await getBalanceSheet(account)) as any;
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

  const obligations: any = response.obligations;
  const obligationsLines: ObligationTrustline[] = [];
  _.map(obligations, (value: string, currency: string) => {
    obligationsLines.push(ObligationToObligationTrustline(account, value, currency));
  });

  delete response.obligations;
  delete response.assets;
  response.lines = obligationsLines;

  return response;
}

function ObligationToObligationTrustline(account: string, value: string, currency: string): ObligationTrustline {
  return {
    account,
    currency,
    balance: new BigNumber(-value).toString(),
    limit: "0",
    limit_peer: "0",
    quality_in: 0,
    quality_out: 0,
    obligation: true,
  };
}
