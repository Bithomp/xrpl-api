import BigNumber from "bignumber.js";
import AddressCodec = require("ripple-address-codec");

import { parseFlags, SortDirection } from "../common/utils";
import * as Client from "../client";
import { LedgerIndex } from "../models/ledger_index";
import { NFTokenInterface, AccountNFTokenInterface, cipheredTaxon } from "../models/account_nfts";
import {
  NFTokenFlagsKeys,
  NFTokenFlagsKeysInterface,
  NFTokenOfferFlagsKeys,
  NFTokenOfferFlagsKeysInterface,
} from "../models/account_nfts";

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

  let account_nfts = response?.result?.account_nfts;
  if (Array.isArray(account_nfts)) {
    account_nfts = account_nfts.sort(sortHelperAccountNFToken);
  }

  return account_nfts;
}

/**
 * Sort account NFTs by issuer and serial
 * issuer1 serial 1
 * issuer1 serial 2
 * issuer2 serial 56
 * issuer3 serial 1
 * issuer3 serial 56
 */
export function sortHelperAccountNFToken(a: AccountNFTokenInterface, b: AccountNFTokenInterface): SortDirection {
  const cmpIssuer = a.Issuer.localeCompare(b.Issuer);
  if (cmpIssuer !== 0) {
    return cmpIssuer as SortDirection;
  }

  if (a.nft_serial < b.nft_serial) {
    return -1;
  }
  if (a.nft_serial > b.nft_serial) {
    return 1;
  }

  return 0;
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

export function parseNFTokenFlags(value: number, options: { excludeFalse?: boolean } = {}): NFTokenFlagsKeysInterface {
  return parseFlags(value, NFTokenFlagsKeys, options);
}

export function parseNFTOfferFlags(
  value: number,
  options: { excludeFalse?: boolean } = {}
): NFTokenOfferFlagsKeysInterface {
  return parseFlags(value, NFTokenOfferFlagsKeys, options);
}

/**
 * 000B 0C44 95F14B0E44F78A264E41713C64B5F89242540EE2 BC8B858E 00000D65
 * +--- +--- +--------------------------------------- +------- +-------
 * |    |    |                                        |        |
 * |    |    |                                        |        `---> Sequence: 3,429
 * |    |    |                                        |
 * |    |    |                                        `---> Taxon: 146,999,694
 * |    |    |
 * |    |    `---> Issuer: rNCFjv8Ek5oDrNiMJ3pw6eLLFtMjZLJnf2
 * |    |
 * |    `---> TransferFee: 314.0 bps or 3.140%
 * |
 * `---> Flags: 11 -> lsfBurnable, lsfOnlyXRP and lsfTransferable
 */
export function parseNFTokenID(tokenID: string): NFTokenInterface | null {
  if (typeof tokenID !== "string" || tokenID.length !== 64) {
    return null;
  }

  const flags = new BigNumber(tokenID.slice(0, 4), 16).toNumber();
  const transferFee = new BigNumber(tokenID.slice(4, 8), 16).toNumber();
  const issuer = AddressCodec.encodeAccountID(Buffer.from(tokenID.slice(8, 48), "hex"));
  const scrambledTaxon = new BigNumber(tokenID.slice(48, 56), 16).toNumber();
  const sequence = new BigNumber(tokenID.slice(56, 64), 16).toNumber();

  return {
    TokenID: tokenID,
    Flags: flags,
    TransferFee: transferFee,
    Issuer: issuer,
    TokenTaxon: cipheredTaxon(sequence, scrambledTaxon),
    Sequence: sequence,
  };
}
