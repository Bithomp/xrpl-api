import { expect } from "chai";
import { Client } from "../../src/index";

describe("Client", () => {
  describe("parseNFTokenFlags", () => {
    it("parses flags", function () {
      const result: any = Client.parseNFTokenFlags(2147483659);
      expect(result).to.eql({
        burnable: true,
        onlyXRP: true,
        transferable: true,
        trustLine: false,
      });
    });
  });

  describe("parseNFTokenFlags", () => {
    it("parses flags sell", function () {
      const result: any = Client.parseNFTOfferFlags(1);
      expect(result).to.eql({
        sellToken: true,
      });
    });

    it("parses flags buy", function () {
      const result: any = Client.parseNFTOfferFlags(0);
      expect(result).to.eql({
        sellToken: false,
      });
    });
  });

  describe("sortHelperAccountNFToken", () => {
    it("sorts tokens", function () {
      const account_nfts = [
        {
          Flags: 0,
          Issuer: "issuer3",
          TokenID: "string",
          TokenTaxons: 0,
          nft_serial: 56,
        },
        {
          Flags: 0,
          Issuer: "issuer1",
          TokenID: "string",
          TokenTaxons: 0,
          nft_serial: 2,
        },
        {
          Flags: 0,
          Issuer: "issuer1",
          TokenID: "string",
          TokenTaxons: 0,
          nft_serial: 1,
        },
        {
          Flags: 0,
          Issuer: "issuer2",
          TokenID: "string",
          TokenTaxons: 0,
          nft_serial: 56,
        },
        {
          Flags: 0,
          Issuer: "issuer3",
          TokenID: "string",
          TokenTaxons: 0,
          nft_serial: 1,
        },
      ];

      const result = account_nfts.sort(Client.sortHelperAccountNFToken);

      expect(result[0].Issuer).to.eql("issuer1");
      expect(result[0].nft_serial).to.eql(1);

      expect(result[1].Issuer).to.eql("issuer1");
      expect(result[1].nft_serial).to.eql(2);

      expect(result[2].Issuer).to.eql("issuer2");
      expect(result[2].nft_serial).to.eql(56);

      expect(result[3].Issuer).to.eql("issuer3");
      expect(result[3].nft_serial).to.eql(1);

      expect(result[4].Issuer).to.eql("issuer3");
      expect(result[4].nft_serial).to.eql(56);
    });
  });

  describe("parseNFTokenID", () => {
    it("parses tokenID", function () {
      const tokenID = "000861A8A7C507A12088BF6A6BB62BAFEE9CDAABA2961DB216E5DA9C00000001";
      const result: any = Client.parseNFTokenID(tokenID);

      expect(result).to.eql({
        TokenID: tokenID,
        Flags: 8,
        TransferFee: 25000,
        Issuer: "rGJn1uZxDX4ksxRPYuj2smP7ZshdwjeSTG",
        TokenTaxon: 0,
        Sequence: 1,
      });
    });

    it("parses tokenID with big taxon", function () {
      const tokenID = "000B0C4495F14B0E44F78A264E41713C64B5F89242540EE2BC8B858E00000D65";
      const result: any = Client.parseNFTokenID(tokenID);

      expect(result).to.eql({
        TokenID: tokenID,
        Flags: 11,
        TransferFee: 3140,
        Issuer: "rNCFjv8Ek5oDrNiMJ3pw6eLLFtMjZLJnf2",
        TokenTaxon: 146999694,
        Sequence: 3429,
      });
    });
  });
});
