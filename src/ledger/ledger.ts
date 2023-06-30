import * as Client from "../client";
import { Connection } from "../connection";

import { LedgerIndex } from "../models/ledger";
import { parseLedger } from "../parse/ledger/ledger";
import { ErrorResponse } from "../models/base_model";
import { FormattedLedger } from "../v1/common/types/objects";

export interface GetLedgerOptions {
  ledgerIndex?: LedgerIndex;
  transactions?: boolean;
  expand?: boolean;
  legacy?: boolean; // returns response in old old format data, same as formatted
  formatted?: boolean; // returns response in old old format data, same as legacy
  includeRawTransactions?: boolean; // for legacy and formatted,
  connection?: Connection;
}

/**
 * @returns {object}
 * "ledger": {
 *   accepted: true,
 *   account_hash: 'D240A9A26FB9780A195B7B77E78262078CE916F7E5C16582BD617E6C96CA7B51',
 *   close_flags: 0,
 *   close_time: 686730951,
 *   close_time_human: '2021-Oct-05 06:35:51.000000000 UTC',
 *   close_time_resolution: 10,
 *   closed: true,
 *   hash: 'E5C1E68EED45C6A72B9BA777AC9BA08F3D34C23D42B52B19276C3E2F5E9E1EFC',
 *   ledger_hash: 'E5C1E68EED45C6A72B9BA777AC9BA08F3D34C23D42B52B19276C3E2F5E9E1EFC',
 *   ledger_index: '66816622',
 *   parent_close_time: 686730950,
 *   parent_hash: 'BA24C903D19BB23080810ECF854FA1AC2612E1C36A00E0903A9EF68C77336C4E',
 *   seqNum: '66816622',
 *   totalCoins: '99990201296815002',
 *   total_coins: '99990201296815002',
 *   transaction_hash: '14317D710ABE357DE559D8519C864103D25361BA7EAF9DE3699556AEF5975463'
 * },
 * "ledger_hash": "9D4A9E1030B525398651F2AD0510479443FBFB561ACD58FB958FEE0232F5E3DF",
 * "ledger_index": 25098377,
 * "validated": true
 * }
 * @exception {Error}
 */
export async function getLedger(
  options: GetLedgerOptions = {}
): Promise<object | FormattedLedger | ErrorResponse> {
  const formatted = options.legacy === true || options.formatted === true;
  const connection: any = options.connection || Client.findConnection("history");
  if (!connection) {
    throw new Error("There is no connection");
  }

  const response: any = await connection.request({
    command: "ledger",
    ledger_index: options.ledgerIndex || "validated",
    transactions: !!options.transactions,
    expand: !!options.expand,
  });

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

  const result = response?.result;
  if (!result) {
    return {
      status: "error",
      error: "invalidResponse",
    };
  }

  if (formatted === true) {
    result.ledger = parseLedger(result.ledger, options.includeRawTransactions === true);
  }

  return result;
}

export async function getLedgerIndex(options: GetLedgerOptions = {}): Promise<number | undefined> {
  const ledgerInfo = await Client.getLedger(options);
  const ledger = (ledgerInfo as any)?.ledger;
  if (ledger) {
    return parseInt(ledger.ledger_index, 10);
  }

  return undefined;
}
