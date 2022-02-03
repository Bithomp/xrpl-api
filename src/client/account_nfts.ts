import * as Client from "../client";
import { LedgerIndex } from "../models/ledger_index";

export interface GetAccountNftsOptions {
  ledgerIndex?: LedgerIndex;
}

/**
 * @returns {object[] | object | null}
 * [
 *   {
 *     Flags: 8,
 *     Issuer: 'rhmfc7GZAJ9j2HuPwBwqCoAJZPai8noFhA',
 *     TokenID: '00080000294032DF27EE9718B0E16D5E2EC89550730CCDDD0000099B00000000',
 *     TokenTaxon: 0,
 *     URI: '697066733A2F2F516D61364C3477474E786B5367475A66415A6F546A457339346A514B4C7A31324338486966523541536D43554135',
 *     nft_serial: 0
 *   }
 * ]
 * @exception {Error}
 */
export async function getAccountNfts(
  account: string,
  options: GetAccountNftsOptions = {}
): Promise<object[] | object | null> {
  const connection: any = Client.findConnection();
  if (!connection) {
    throw new Error("There is no connection");
  }

  await connection.connect();
  const response = await connection.request({
    command: "account_nfts",
    account,
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

  return response?.result?.account_nfts;
}

export interface GetAccountNftSellOffersOptions {
  ledgerIndex?: number | ("validated" | "closed" | "current");
}

/**
 * @returns {object[] | object | null}
 * [
 *   {
 *     amount: '1000000',
 *     flags: 1,
 *     index: '98491D03DD3CC3658D99754C05DF26E6FCC0F69719697B85A6587CBD1455F387',
 *     owner: 'rhmfc7GZAJ9j2HuPwBwqCoAJZPai8noFhA'
 *   }
 * ]
 * @exception {Error}
 */
export async function getAccountNftSellOffers(
  tokenid: string,
  options: GetAccountNftSellOffersOptions = {}
): Promise<object[] | object | null> {
  const connection: any = Client.findConnection();
  if (!connection) {
    throw new Error("There is no connection");
  }

  await connection.connect();
  const response = await connection.request({
    command: "nft_sell_offers",
    tokenid,
    ledger_index: options.ledgerIndex || "validated",
  });

  if (!response) {
    return null;
  }

  if (response.error) {
    const { error, error_code, error_message, status, validated } = response;

    return {
      tokenid,
      error,
      error_code,
      error_message,
      status,
      validated,
    };
  }

  return response?.result?.offers;
}

export interface GetAccountNftBuyOffersOptions {
  ledgerIndex?: number | ("validated" | "closed" | "current");
}

/**
 * @returns {object[] | object | null}
 * [
 *   {
 *     amount: '1000000',
 *     flags: 1,
 *     index: '98491D03DD3CC3658D99754C05DF26E6FCC0F69719697B85A6587CBD1455F387',
 *     owner: 'rhmfc7GZAJ9j2HuPwBwqCoAJZPai8noFhA'
 *   }
 * ]
 * @exception {Error}
 */
export async function getAccountNftBuyOffers(
  tokenid: string,
  options: GetAccountNftBuyOffersOptions = {}
): Promise<object[] | object | null> {
  const connection: any = Client.findConnection();
  if (!connection) {
    throw new Error("There is no connection");
  }

  await connection.connect();
  const response = await connection.request({
    command: "nft_buy_offers",
    tokenid,
    ledger_index: options.ledgerIndex || "validated",
  });

  if (!response) {
    return null;
  }

  if (response.error) {
    const { error, error_code, error_message, status, validated } = response;

    return {
      tokenid,
      error,
      error_code,
      error_message,
      status,
      validated,
    };
  }

  return response?.result?.offers;
}
