import BigNumber from "bignumber.js";

import * as Client from "../client";
import { Settings, AccountFlags, AccountFields } from "../common/constants";

export interface GetAccountInfoOptions {
  ledgerVersion?: number | ("validated" | "closed" | "current");
  signerLists?: boolean;
}

/**
{
  Account: 'rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz',
  Balance: '958859539',
  Domain: '746573742E626974686F6D702E636F6D',
  Flags: 0,
  LedgerEntryType: 'AccountRoot',
  OwnerCount: 0,
  PreviousTxnID: '70412C213409FF78EC2244F46754B9AFBA87E71361A1CC2030076DA7A64261A0',
  PreviousTxnLgrSeq: 22330597,
  Sequence: 1952,
  index: 'E81B13BE87D0BEE807EE2AB986B4C39B911AD9EAB64946A98AF149367CBEAE93'
}
*/
export async function getAccountInfoAsync(account: string, options: GetAccountInfoOptions = {}) {
  const connection: any = Client.findConnection();
  if (!connection) {
    throw new Error("There is no connection");
  }

  await connection.connect();
  const response = await connection.request({
    command: "account_info",
    account,
    ledger_index: options.ledgerVersion || "validated",
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

  return response?.result?.account_data;
}

export async function isActivatedAsync(account: string) {
  const response: any = await getAccountInfoAsync(account);

  if (!response || response.error === "actNotFound") {
    return false;
  }

  return true;
}

export type SettingsOptions = {
  ledgerVersion?: number | "validated" | "closed" | "current";
};

/**
{
  requireAuthorization: true,
  disallowIncomingXRP: true,
  domain: "test.bithomp.com",
}
 */
export function getSettings(accountInfo: any) {
  const parsedFlags: object = parseAccountFlags(accountInfo.Flags, { excludeFalse: true });
  const parsedFields: object = parseFields(accountInfo);
  const settings: object = Object.assign({}, parsedFlags, parsedFields);

  return settings;
}

function parseAccountFlags(value: number, options: { excludeFalse?: boolean } = {}): Settings {
  const settings = {};
  for (const flagName in AccountFlags) {
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

function parseFields(data: any): object {
  const settings: any = {};
  for (const fieldName in AccountFields) {
    const fieldValue = data[fieldName];
    if (fieldValue != null) {
      const info = AccountFields[fieldName];
      settings[info.name] = parseField(info, fieldValue);
    }
  }

  // Since an account can own at most one SignerList,
  // this array must have exactly one member if it is present.
  if (data.signer_lists && data.signer_lists.length === 1) {
    settings.signers = {};
    if (data.signer_lists[0].SignerQuorum) {
      settings.signers.threshold = data.signer_lists[0].SignerQuorum;
    }
    if (data.signer_lists[0].SignerEntries) {
      settings.signers.weights = data.signer_lists[0].SignerEntries.map((entry: any) => {
        return {
          address: entry.SignerEntry.Account,
          weight: entry.SignerEntry.SignerWeight,
        };
      });
    }
  }
  return settings;
}
