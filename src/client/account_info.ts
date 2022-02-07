import BigNumber from "bignumber.js";

import * as Client from "../client";
import { Settings, AccountFlags, AccountFields } from "../common/constants";
import { LedgerIndex } from "../models/ledger_index";

const BLACKHOLE_ACCOUNTS = ["rrrrrrrrrrrrrrrrrrrrBZbvji", "rrrrrrrrrrrrrrrrrrrrrhoLvTp"];

export interface GetAccountInfoOptions {
  ledgerIndex?: LedgerIndex;
  signerLists?: boolean;
}

/**
 * @returns {Promise<object | null>} like
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
export async function getAccountInfo(account: string, options: GetAccountInfoOptions = {}): Promise<object | null> {
  const connection: any = Client.findConnection();
  if (!connection) {
    throw new Error("There is no connection");
  }

  await connection.connect();
  const response = await connection.request({
    command: "account_info",
    account,
    ledger_index: options.ledgerIndex || "validated",
    signer_lists: !!options.signerLists,
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

/**
 * @returns {Promise<object | null>} like
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
export async function getAccountInfoData(account: string, options: GetAccountInfoOptions = {}): Promise<object | null> {
  const response: any = await getAccountInfo(account, options);

  if (!response) {
    return null;
  }

  if (response.error) {
    return response;
  }

  return response?.account_data;
}

export async function isActivated(account: string): Promise<boolean> {
  const response: any = await getAccountInfo(account);

  if (!response || response.error === "actNotFound") {
    return false;
  }

  return true;
}

/**
 * @returns {object} like
 * {
 *   requireAuthorization: true,
 *   disallowIncomingXRP: true,
 *   domain: "test.bithomp.com",
 * }
 */
export function getSettings(accountInfo: any, excludeFalse: boolean = true): object {
  const parsedFlags = parseAccountFlags(accountInfo.Flags, { excludeFalse });
  const parsedFields = parseAccountFields(accountInfo, { excludeFalse });

  return {
    ...parsedFlags,
    ...parsedFields,
  };
}

export function parseAccountFlags(value: number, options: { excludeFalse?: boolean } = {}): Settings {
  const settings = {};
  for (const flagName in AccountFlags) {
    // tslint:disable-next-line:no-bitwise
    if (value & AccountFlags[flagName]) {
      settings[flagName] = true;
    } else {
      if (!options.excludeFalse) {
        settings[flagName] = false;
      }
    }
  }
  return settings;
}

export function parseAccountFields(accountInfo: any, options: { excludeFalse?: boolean } = {}): object {
  const settings: any = {};

  if (
    // tslint:disable-next-line:no-bitwise
    accountInfo.Flags & AccountFlags.disableMaster &&
    BLACKHOLE_ACCOUNTS.includes(accountInfo.RegularKey) &&
    !accountInfo.signer_lists
  ) {
    settings.blackholed = true;
  } else if (!options.excludeFalse) {
    settings.blackholed = false;
  }

  // tslint:disable-next-line:forin
  for (const fieldName in AccountFields) {
    const fieldValue = accountInfo[fieldName];
    if (fieldValue != null) {
      const info = AccountFields[fieldName];
      settings[info.name] = parseField(info, fieldValue);
    }
  }

  function parseField(info: any, value: any) {
    if (info.encoding === "hex" && !info.length) {
      // e.g. "domain"
      return Buffer.from(value, "hex").toString("ascii");
    }
    if (info.shift) {
      return new BigNumber(value).shiftedBy(-info.shift).toNumber();
    }
    return value;
  }

  return settings;
}
