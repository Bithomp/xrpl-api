import * as Client from "../client";
import { LedgerIndex } from "../models/ledger";
import { sortHelperAccountNFToken } from "../models/account_nfts";
import { parseMarker, createMarker } from "../common/utils";
import { ErrorResponse } from "../models/base_model";
import { removeUndefined } from "../common";

export interface GetAccountNftsOptions {
  ledgerIndex?: LedgerIndex;
  limit?: number;
  marker?: any;
}

/**
 * @returns {object[] | ErrorResponse}
 * {
 *   account: "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z",
 *   ledger_hash: "BD24686C403D2FB1B1C38C56BF0A672C4073B0376F842EDD59BA0937FD68BABC",
 *   ledger_index: 70215272,
 *   account_nfts: [
 *     {
 *       Flags: 8,
 *       Issuer: 'rhmfc7GZAJ9j2HuPwBwqCoAJZPai8noFhA',
 *       NFTokenID: '00080000294032DF27EE9718B0E16D5E2EC89550730CCDDD0000099B00000000',
 *       NFTokenTaxon: 0,
 *       URI: '697066733A2F2F516D61364C3477474E786B5367475A66415A6F546A457339346A514B4C7A31324338486966523541536D43554135',
 *       nft_serial: 0
 *     }
 *   ]
 *   validated: true,
 * }
 * @exception {Error}
 */
export async function getAccountNfts(
  account: string,
  options: GetAccountNftsOptions = {}
): Promise<object[] | ErrorResponse> {
  const { hash, marker } = parseMarker(options.marker);
  options.marker = marker;
  const connection: any = Client.findConnection(undefined, undefined, undefined, hash);
  if (!connection) {
    throw new Error("There is no connection");
  }

  const response = await connection.request({
    command: "account_nfts",
    account,
    ledger_index: options.ledgerIndex || "validated",
    marker: options.marker,
  });

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

  const result = response?.result;
  if (!result) {
    return {
      account,
      status: "error",
      error: "invalidResponse",
    };
  }

  if (Array.isArray(result.account_nfts)) {
    result.account_nfts = result.account_nfts.sort(sortHelperAccountNFToken);
  }

  const newMarker = createMarker(connection.hash, result.marker);
  if (newMarker) {
    result.marker = newMarker;
  }

  return result;
}

interface FindAccountNftsOptions extends GetAccountNftsOptions {
  timeout?: number;
}

export async function findAccountNfts(
  account: string,
  options: FindAccountNftsOptions = { timeout: 15000 }
): Promise<object[] | ErrorResponse> {
  const timeStart = new Date();
  const limit = options.limit;
  let response: any;
  const accountNfts: any[] = [];

  // download all nfts with marker
  while (true) {
    const currentTime = new Date();
    // timeout validation
    if (options.timeout && currentTime.getTime() - timeStart.getTime() > options.timeout) {
      options.timeout = currentTime.getTime() - timeStart.getTime();
      break;
    }

    if (options.limit && limit) {
      options.limit = limit - accountNfts.length;
    }

    response = await getAccountNfts(account, options);
    if (!response || response.error) {
      return response;
    }

    accountNfts.push(...response.account_nfts);
    if (limit && accountNfts.length >= limit) {
      response.limit = accountNfts.length; // override last limit with total one
      break;
    }

    if (response.marker) {
      options.marker = response.marker;
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

  response.account_nfts = accountNfts;

  return response;
}

export interface GetAccountNftSellOffersOptions {
  ledgerIndex?: LedgerIndex;
}

/**
 * @returns {object[] | ErrorResponse}
 * {
 *   account: "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z",
 *   ledger_hash: "BD24686C403D2FB1B1C38C56BF0A672C4073B0376F842EDD59BA0937FD68BABC",
 *   ledger_index: 70215272,
 *   offers: [
 *     {
 *       amount: '1000000',
 *       flags: 1,
 *       index: '98491D03DD3CC3658D99754C05DF26E6FCC0F69719697B85A6587CBD1455F387',
 *       owner: 'rhmfc7GZAJ9j2HuPwBwqCoAJZPai8noFhA'
 *     }
 *   ]
 *   validated: true,
 * }
 * @exception {Error}
 */
export async function getAccountNftSellOffers(
  nftID: string,
  options: GetAccountNftSellOffersOptions = {}
): Promise<object[] | ErrorResponse> {
  // doesn't work with clio
  const connection: any = Client.findConnection("!clio");
  if (!connection) {
    throw new Error("There is no connection");
  }

  const response = await connection.request({
    command: "nft_sell_offers",
    nft_id: nftID,
    ledger_index: options.ledgerIndex || "validated",
  });

  if (!response) {
    return {
      nft_id: nftID,
      status: "error",
      error: "invalidResponse",
    };
  }

  if (response.error) {
    const { error, error_code, error_message, error_exception, status, validated } = response;

    return removeUndefined({
      nft_id: nftID,
      error,
      error_code,
      error_message,
      error_exception,
      status,
      validated,
    });
  }

  return response?.result;
}

export interface GetAccountNftBuyOffersOptions {
  ledgerIndex?: LedgerIndex;
}

/**
 * @returns {object[] | object}
 * {
 *   account: "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z",
 *   ledger_hash: "BD24686C403D2FB1B1C38C56BF0A672C4073B0376F842EDD59BA0937FD68BABC",
 *   ledger_index: 70215272,
 *   offers: [
 *     {
 *       amount: '1000000',
 *       flags: 1,
 *       index: '98491D03DD3CC3658D99754C05DF26E6FCC0F69719697B85A6587CBD1455F387',
 *       owner: 'rhmfc7GZAJ9j2HuPwBwqCoAJZPai8noFhA'
 *     }
 *   ]
 *   validated: true,
 * }
 * @exception {Error}
 */
export async function getAccountNftBuyOffers(
  nftID: string,
  options: GetAccountNftBuyOffersOptions = {}
): Promise<object[] | object> {
  // doesn't work with clio
  const connection: any = Client.findConnection("!clio");
  if (!connection) {
    throw new Error("There is no connection");
  }

  const response = await connection.request({
    command: "nft_buy_offers",
    nft_id: nftID,
    ledger_index: options.ledgerIndex || "validated",
  });

  if (!response) {
    return {
      nft_id: nftID,
      status: "error",
      error: "invalidResponse",
    };
  }

  if (response.error) {
    const { error, error_code, error_message, error_exception, status, validated } = response;

    return removeUndefined({
      nft_id: nftID,
      error,
      error_code,
      error_message,
      error_exception,
      status,
      validated,
    });
  }

  return response?.result;
}
