import { LedgerEntry } from "xrpl";
import { Trustline } from "./account_lines";
const { RippleStateFlags } = LedgerEntry;
import { removeUndefined } from "../common";
import { ledgerTimeToUnixTime } from "../models/ledger";
import { Amount } from "../types";

// https://github.com/XRPLF/xrpl.js/blob/2b424276344b2aa8b8b76d621500f4d9e1436663/packages/xrpl/src/models/methods/accountObjects.ts#L61
/**
 * Account Objects can be a Check, a DepositPreauth, an Escrow, an Offer, a
 * PayChannel, a SignerList, a Ticket, or a RippleState.
 */
export type AccountObject =
  | LedgerEntry.Check
  | LedgerEntry.DepositPreauth
  | LedgerEntry.Escrow
  | LedgerEntry.Offer
  | LedgerEntry.PayChannel
  | LedgerEntry.SignerList
  | LedgerEntry.Ticket
  | LedgerEntry.RippleState;

export type AccountObjectType = Exclude<LedgerEntry.LedgerEntryFilter, "amendments" | "fee" | "hashes"> | "uri_token";

export interface AccountObjects {
  account: string;
  account_objects: AccountObject[];
  ledger_hash?: string;
  ledger_index?: number;
  ledger_current_index?: number;
  limit?: number;
  marker?: string;
  validated?: boolean;
}

export interface AccountNFTObjectsResponse {
  account: string;
  nft_offers: AccountNFTOffersInterface[];
  ledger_hash?: string;
  ledger_index?: number;
  ledger_current_index?: number;
  limit?: number;
  marker?: string;
  validated?: boolean;
}

export interface AccountNFTOffersInterface {
  nft_id: string;
  amount: Amount;
  flags: number;
  index: string;
  owner: string;
  destination?: string;
  expiration?: number;
  ledger_index: number;
  transaction_hash: string;
}

// NOTE: URI Tokens is not part of mainnet, this code can be changed in the future without notice
export interface AccountURITokensInterface {
  flags: number;
  index: string;
  owner: string;
  issuer: string;
  uri: number;
  digest?: string;
  amount?: Amount;
  destination?: string;
  ledger_index: number;
  transaction_hash: string;
}

// NOTE: URI Tokens is not part of mainnet, this code can be changed in the future without notice
export interface AccountURITokensObjectsResponse {
  account: string;
  uritokens: AccountURITokensInterface[];
  ledger_hash?: string;
  ledger_index?: number;
  ledger_current_index?: number;
  limit?: number;
  marker?: string;
  validated?: boolean;
}

/**
 * https://gist.github.com/WietseWind/5df413334385367c548a148de3d8a713
 * https://github.com/XRPL-Labs/XUMM-App/blob/2c39d04e65dd8d48001f4cb452b1fbe2e2c53f00/src/services/AccountService.ts#L198
 *
 * This function returns account_lines line results
 * based on account_objects (type = state) results,
 * » Returns only the account_lines to show based on:
 *   - Counts towards your reserve
 */
export function accountObjectsToAccountLines(account: string, accountObjects: AccountObject[]): Trustline[] {
  const notInDefaultState = accountObjects.filter((node: any) => {
    if (node.LedgerEntryType !== "RippleState") {
      return false;
    }

    if (node.HighLimit.issuer === account) {
      // eslint-disable-next-line no-bitwise
      if (node.Flags & RippleStateFlags.lsfHighReserve) {
        if (isPositiveBalance(node.Balance.value)) {
          return false;
        }

        return true;
      }

      // if balance is positive, it's a trustline reserve owned by the issuer, but balance is belongs to the account
      if (isNegativeBalance(node.Balance.value)) {
        return true;
      }
    } else {
      // eslint-disable-next-line no-bitwise
      if (node.Flags & RippleStateFlags.lsfLowReserve) {
        if (isNegativeBalance(node.Balance.value)) {
          return false;
        }

        return true;
      }

      // if balance is negative, it's a trustline reserve owned by the issuer, but balance is belongs to the account
      if (isPositiveBalance(node.Balance.value)) {
        return true;
      }
    }

    return false;
  });

  const accountLinesFormatted = notInDefaultState.map((node) =>
    RippleStateToTrustLine(node as LedgerEntry.RippleState, account)
  );

  return accountLinesFormatted;
}

function isPositiveBalance(balance: string): boolean {
  return balance !== "0" && balance[0] !== "-";
}

function isNegativeBalance(balance: string): boolean {
  return balance !== "0" && balance[0] === "-";
}

const RippleStateToTrustLine = (ledgerEntry: LedgerEntry.RippleState, account: string): Trustline => {
  const parties = [ledgerEntry.HighLimit, ledgerEntry.LowLimit];
  const [self, counterparty] = ledgerEntry.HighLimit.issuer === account ? parties : parties.reverse();

  /* eslint-disable no-bitwise */
  const ripplingFlags = [
    (RippleStateFlags.lsfHighNoRipple & ledgerEntry.Flags) === RippleStateFlags.lsfHighNoRipple,
    (RippleStateFlags.lsfLowNoRipple & ledgerEntry.Flags) === RippleStateFlags.lsfLowNoRipple,
  ];
  /* eslint-enable no-bitwise */

  const [no_ripple, no_ripple_peer] =
    ledgerEntry.HighLimit.issuer === account ? ripplingFlags : ripplingFlags.reverse();

  /* eslint-disable multiline-ternary */
  const balance =
    ledgerEntry.HighLimit.issuer === account && ledgerEntry.Balance.value.startsWith("-")
      ? ledgerEntry.Balance.value.slice(1)
      : ledgerEntry.Balance.value;
  /* eslint-enable multiline-ternary */

  const lockedBalance = (ledgerEntry as any).LockedBalance?.value;
  let lockCount = undefined;
  if (lockedBalance) {
    lockCount = (ledgerEntry as any).LockCount;
  }

  return removeUndefined({
    account: counterparty.issuer,
    balance,
    currency: self.currency,
    limit: self.value,
    limit_peer: counterparty.value,
    lock_count: lockCount,
    locked_balance: lockedBalance,
    no_ripple,
    no_ripple_peer,
  }) as Trustline;
};

export function accountObjectsToNFTOffers(accountObjects: AccountObject[]): AccountNFTOffersInterface[] {
  const nftOfferObjects = accountObjects.filter((obj: any) => {
    return obj.LedgerEntryType === "NFTokenOffer";
  });

  const nftOffers = nftOfferObjects.map((obj: any) => {
    let expiration: number = obj.Expiration;
    if (typeof expiration === "number") {
      expiration = ledgerTimeToUnixTime(expiration);
    }

    return removeUndefined({
      nft_id: obj.NFTokenID,
      amount: obj.Amount,
      flags: obj.Flags,
      index: obj.index,
      owner: obj.Owner,
      destination: obj.Destination,
      expiration,
      ledger_index: obj.PreviousTxnLgrSeq,
      transaction_hash: obj.PreviousTxnID,
    });
  });

  return nftOffers;
}

// NOTE: URI Tokens is not part of mainnet, this code can be changed in the future without notice
export function accountObjectsToURITokens(accountObjects: AccountObject[]): AccountURITokensInterface[] {
  const uriTokenObjects = accountObjects.filter((obj: any) => {
    return obj.LedgerEntryType === "URIToken";
  });

  const uritokens = uriTokenObjects.map((obj: any) => {
    return removeUndefined({
      flags: obj.Flags,
      index: obj.index,
      owner: obj.Owner,
      issuer: obj.Issuer,
      uri: obj.URI,
      digest: obj.Digest,
      amount: obj.Amount,
      destination: obj.Destination,
      ledger_index: obj.PreviousTxnLgrSeq,
      transaction_hash: obj.PreviousTxnID,
    });
  });

  return uritokens;
}
