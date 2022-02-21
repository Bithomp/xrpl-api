import { NFTokenMintFlags, NFTokenCreateOfferFlags } from "xrpl";

export interface NFTokenInterface {
  Flags: number;
  Issuer: string;
  TokenID: string;
  TokenTaxon: number;
  TransferFee: number;
  Sequence: number;
}

export interface AccountNFTokenInterface {
  Flags: number;
  Issuer: string;
  TokenID: string;
  TokenTaxons: number;
  nft_serial: number;
}

export const NFTokenFlagsKeys = {
  burnable: NFTokenMintFlags.tfBurnable,
  onlyXRP: NFTokenMintFlags.tfOnlyXRP,
  trustLine: NFTokenMintFlags.tfTrustLine,
  transferable: NFTokenMintFlags.tfTransferable,
  // reservedFlag: NFTokenMintFlags.tfReservedFlag,
};

export interface NFTokenFlagsKeysInterface {
  burnable?: boolean;
  onlyXRP?: boolean;
  trustLine?: boolean;
  transferable?: boolean;
  // reservedFlag?: boolean
}

export interface NFTokenOfferFlagsKeysInterface {
  sellToken?: boolean;
}

export const NFTokenOfferFlagsKeys = {
  sellToken: NFTokenCreateOfferFlags.tfSellToken,
};

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
  // tslint:disable-next-line:no-bitwise
  return taxon ^ (384160001 * tokenSeq + 2459);
}
