import { Request } from "xrpl";
import * as Client from "../client";
import { Connection } from "../connection";
import { LedgerIndex } from "../models/ledger";
import { AccountInfoResponse, AccountInfoDataResponse } from "../models/account_info";
import { ErrorResponse } from "../models/base_model";
import { parseAccountInfoData } from "../parse/ledger/account-info";
import { FormattedAccountInfoData } from "../types";
import { removeUndefined } from "../common";
import { isClioResponse } from "../common/utils";

export interface GetAccountInfoOptions {
  ledgerIndex?: LedgerIndex;
  signerLists?: boolean;
  connection?: Connection;
}

/**
 * @returns {Promise<AccountInfoResponse | ErrorResponse>} like
 * {
 *   "account_data": {
 *     Account: 'rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz',
 *     Balance: '958859539',
 *     Domain: '746573742E626974686F6D702E636F6D',
 *     Flags: 0,
 *     LedgerEntryType: 'AccountRoot',
 *     OwnerCount: 0,
 *     PreviousTxnID: '70412C213409FF78EC2244F46754B9AFBA87E71361A1CC2030076DA7A64261A0',
 *     PreviousTxnLgrSeq: 22330597,
 *     Sequence: 1952,
 *     index: 'E81B13BE87D0BEE807EE2AB986B4C39B911AD9EAB64946A98AF149367CBEAE93'
 *   },
 * "ledger_hash": "9D4A9E1030B525398651F2AD0510479443FBFB561ACD58FB958FEE0232F5E3DF",
 * "ledger_index": 25098377,
 * "validated": true
 * }
 * @exception {Error}
 */
export async function getAccountInfo(
  account: string,
  options: GetAccountInfoOptions = {}
): Promise<AccountInfoResponse | ErrorResponse> {
  const connection = options.connection || Client.findConnection();
  if (!connection) {
    throw new Error("There is no connection");
  }

  const request: Request = {
    command: "account_info",
    account,
    ledger_index: options.ledgerIndex || "validated",
    signer_lists: !!options.signerLists,
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

  const result = response.result as AccountInfoResponse;
  if (!result) {
    return {
      account,
      status: "error",
      error: "invalidResponse",
    };
  }

  // clio could return signer_lists in top level or in account_data
  if (result.signer_lists) {
    // duplicate signer_lists to account_data, to prevent breaking changes and backward compatibility
    result.account_data.signer_lists = result.signer_lists.slice();
  }

  // NOTE: in clio response signer_lists could be missing in account_data
  // after this commit https://github.com/XRPLF/clio/commit/c780ef8a0b0a3e735eceea796c89213079c0e812 for version 2.6.0
  // remove this check after clio is updated in production
  if (request.signer_lists === true && isClioResponse(response)) {
    if (result.account_data.signer_lists === undefined) {
      result.account_data.signer_lists = [];
    }
  }

  return result;
}

export interface GetAccountInfoDataOptions extends GetAccountInfoOptions {
  formatted?: boolean; // returns response in old old format data
}

/**
 * @returns {Promise<AccountInfoDataResponse>} like
 * {
 *   Account: 'rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz',
 *   Balance: '958859539',
 *   Domain: '746573742E626974686F6D702E636F6D',
 *   Flags: 0,
 *   LedgerEntryType: 'AccountRoot',
 *   OwnerCount: 0,
 *   PreviousTxnID: '70412C213409FF78EC2244F46754B9AFBA87E71361A1CC2030076DA7A64261A0',
 *   PreviousTxnLgrSeq: 22330597,
 *   Sequence: 1952,
 *   index: 'E81B13BE87D0BEE807EE2AB986B4C39B911AD9EAB64946A98AF149367CBEAE93'
 * }
 * @exception {Error}
 */
export async function getAccountInfoData(
  account: string,
  options: GetAccountInfoDataOptions = {}
): Promise<AccountInfoDataResponse | FormattedAccountInfoData | ErrorResponse> {
  const formatted = options.formatted === true;
  const response = await getAccountInfo(account, options);

  if ("error" in response) {
    return response;
  }

  if (formatted) {
    return parseAccountInfoData(response);
  }

  return response.account_data;
}

export async function isActivated(account: string): Promise<boolean> {
  const response = await getAccountInfo(account);

  if (!response) {
    return false;
  }

  if ("error" in response /* && response.error === "actNotFound"*/) {
    return false;
  }

  return true;
}
