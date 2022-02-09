// 1.2.1.1. The NFToken object
export enum NFTokenFlags {
  /**
   * If set, indicates that the issuer (or an entity authorized by the issuer) can destroy the object.
   * The object's owner can always do so.
   */
  lsfBurnable = 0x0001,

  /**
   * If set, indicates that the tokens can only be offered or sold for XRP.
   */
  lsfOnlyXRP = 0x0002,

  /**
   * If set, indicates that the issuer wants a trustline to be automatically created.
   */
  lsfTrustLine = 0x0004,
  /**
   * If set, indicates that this NFT can be transferred.
   * This flag has no effect if the token is being transferred from the issuer or to the issuer.
   */
  lsfTransferable = 0x0008,

  /**
   * This proposal reserves this flag for future use. Attempts to set this flag should fail.
   */
  lsfReservedFlag = 0x8000,
}

export interface NFTokenFlagsInterface {
  burnable?: boolean;
  onlyXRP?: boolean;
  trustLine?: boolean;
  transferable?: boolean;
  reservedFlag?: boolean;
}

export const NFTokenFlagsKeys = {
  burnable: NFTokenFlags.lsfBurnable,
  onlyXRP: NFTokenFlags.lsfOnlyXRP,
  trustLine: NFTokenFlags.lsfTrustLine,
  transferable: NFTokenFlags.lsfTransferable,
  // reservedFlag: NFTokenFlags.lsfReservedFlag,
};

// 1.4.1. The NFTokenOffer
// 1.4.1.1. NFTokenOfferID Format
export enum NFTokenOfferFlags {
  /**
   * If set, indicates that the offer is a buy offer. Otherwise, the offer is a sell offer.
   */
  lsfBuyToken = 0x00000001,

  /**
   * If set, indicates that the offer has been approved by the issuer.
   * This flag can only be set by the Issuer of the token or an account authorized by the issuer
   * (i.e. the MintAccount listed in the account root of the Issuer) and only
   * if the token has the flag indicating that authorization is required.
   */
  lsfAuthorized = 0x00000002,
}

export interface NFTokenOfferFlagsInterface {
  buyToken?: boolean;
  authorized?: boolean;
}

// 1.5.4. NFTokenCreateOffer transaction
// 1.5.4.1. Fields
export enum NFTokenCreateOfferFlags {
  /**
   * If set, indicates that the offer is a sell offer. Otherwise, it is a buy offer.
   */
  tfSellToken = 0x00000001,
}

export interface NFTokenCreateOfferFlagsInterface {
  sellToken?: boolean;
}
