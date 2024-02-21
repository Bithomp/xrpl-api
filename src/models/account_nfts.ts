import BigNumber from "bignumber.js";
import AddressCodec = require("ripple-address-codec");

import { SortDirection, bytesToHex } from "../common";

export interface NFTokenInterface {
  Flags: number;
  Issuer: string;
  NFTokenID: string;
  NFTokenTaxon: number;
  TransferFee: number;
  Sequence: number;
}

export interface AccountNFTokenInterface {
  Flags: number;
  Issuer: string;
  NFTokenID: string;
  TokenTaxons: number;
  nft_serial: number;
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

export function cipheredTaxon(tokenSeq: number, taxon: number) {
  // An issuer may issue several NFTs with the same taxon; to ensure that NFTs
  // are spread across multiple pages we lightly mix the taxon up by using the
  // sequence (which is not under the issuer's direct control) as the seed for
  // a simple linear congruential generator.
  //
  // From the Hull-Dobell theorem we know that f(x)=(m*x+c) mod n will yield a
  // permutation of [0, n) when n is a power of 2 if m is congruent to 1 mod 4
  // and c is odd.
  //
  // Here we use m = 384160001 and c = 2459. The modulo is implicit because we
  // use 2^32 for n and the arithmetic gives it to us for "free".
  //
  // Note that the scramble value we calculate is not cryptographically secure
  // but that's fine since all we're looking for is some dispersion.
  //
  // **IMPORTANT** Changing these numbers would be a breaking change requiring
  //               an amendment along with a way to distinguish token IDs that
  //               were generated with the old code.

  const m = 384160001n;
  const c = 2459n;
  const max = 4294967296n;

  const p1 = (m * BigInt(tokenSeq)) % max;

  const p2 = (p1 + c) % max;

  // eslint-disable-next-line no-bitwise
  return (taxon ^ Number(p2)) >>> 0;
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
export function parseNFTokenID(nftokenID: string): NFTokenInterface | null {
  if (typeof nftokenID !== "string" || nftokenID.length !== 64) {
    return null;
  }

  const flags = new BigNumber(nftokenID.slice(0, 4), 16).toNumber();
  const transferFee = new BigNumber(nftokenID.slice(4, 8), 16).toNumber();
  const issuer = AddressCodec.encodeAccountID(Buffer.from(nftokenID.slice(8, 48), "hex"));
  const scrambledTaxon = new BigNumber(nftokenID.slice(48, 56), 16).toNumber();
  const sequence = new BigNumber(nftokenID.slice(56, 64), 16).toNumber();

  return {
    NFTokenID: nftokenID,
    Flags: flags,
    TransferFee: transferFee,
    Issuer: issuer,
    NFTokenTaxon: cipheredTaxon(sequence, scrambledTaxon),
    Sequence: sequence,
  };
}

export function buildNFTokenID(
  flags: number,
  transferFee: number,
  issuer: string,
  taxon: number,
  sequence: number
): string {
  const scrambledTaxon = cipheredTaxon(sequence, taxon);

  return (
    // @ts-ignore
    new BigNumber(flags).toString(16).padStart(4, "0").toUpperCase() +
    // @ts-ignore
    new BigNumber(transferFee).toString(16).padStart(4, "0").toUpperCase() +
    bytesToHex(AddressCodec.decodeAccountID(issuer).buffer) +
    // @ts-ignore
    new BigNumber(scrambledTaxon).toString(16).padStart(8, "0").toUpperCase() +
    // @ts-ignore
    new BigNumber(sequence).toString(16).padStart(8, "0").toUpperCase()
  );
}
