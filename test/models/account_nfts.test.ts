import { expect } from "chai";
import { Models } from "../../src/index";

describe("Models", () => {
  describe("parseNFTokenFlags", () => {
    it("parses flags", function () {
      const result: any = Models.parseNFTokenFlags(2147483659);
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
      const result: any = Models.parseNFTOfferFlags(1);
      expect(result).to.eql({
        sellToken: true,
      });
    });

    it("parses flags buy", function () {
      const result: any = Models.parseNFTOfferFlags(0);
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
          NFTokenID: "string",
          TokenTaxons: 0,
          nft_serial: 56,
        },
        {
          Flags: 0,
          Issuer: "issuer1",
          NFTokenID: "string",
          TokenTaxons: 0,
          nft_serial: 2,
        },
        {
          Flags: 0,
          Issuer: "issuer1",
          NFTokenID: "string",
          TokenTaxons: 0,
          nft_serial: 1,
        },
        {
          Flags: 0,
          Issuer: "issuer2",
          NFTokenID: "string",
          TokenTaxons: 0,
          nft_serial: 56,
        },
        {
          Flags: 0,
          Issuer: "issuer3",
          NFTokenID: "string",
          TokenTaxons: 0,
          nft_serial: 1,
        },
      ];

      const result = account_nfts.sort(Models.sortHelperAccountNFToken);

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
    it("parses nftokenID", function () {
      const nftokenID = "000861A8A7C507A12088BF6A6BB62BAFEE9CDAABA2961DB216E5DA9C00000001";
      const result: any = Models.parseNFTokenID(nftokenID);

      expect(result).to.eql({
        NFTokenID: nftokenID,
        Flags: 8,
        TransferFee: 25000,
        Issuer: "rGJn1uZxDX4ksxRPYuj2smP7ZshdwjeSTG",
        NFTokenTaxon: 0,
        Sequence: 1,
      });
    });

    it("parses nftokenID with big taxon", function () {
      const nftokenID = "000B0C4495F14B0E44F78A264E41713C64B5F89242540EE2BC8B858E00000D65";
      const result: any = Models.parseNFTokenID(nftokenID);

      expect(result).to.eql({
        NFTokenID: nftokenID,
        Flags: 11,
        TransferFee: 3140,
        Issuer: "rNCFjv8Ek5oDrNiMJ3pw6eLLFtMjZLJnf2",
        NFTokenTaxon: 146999694,
        Sequence: 3429,
      });
    });

    it("parses nftokenID with unsigned taxon", function () {
      const nftokenID = "000000005EC8BC31F0415E5DD4A8AAAC3718249F8F27323C2EEE87B80000001E";
      const result: any = Models.parseNFTokenID(nftokenID);

      expect(result).to.eql({
        NFTokenID: nftokenID,
        Flags: 0,
        TransferFee: 0,
        Issuer: "r9ewzMXVRAD9CjZQ6LTQ4P21vUUucDuqd4",
        NFTokenTaxon: 2147483649,
        Sequence: 30,
      });
    });

    it("parses nftokenID with unsigned sequence", function () {
      const nftokenID = "00081388B9BD76A3377E66D29304CC012DDAE79A6956C4F4E5AA50A6045B6BC4";
      const result: any = Models.parseNFTokenID(nftokenID);

      expect(result).to.eql({
        NFTokenID: nftokenID,
        Flags: 8,
        TransferFee: 5000,
        Issuer: "rHAayepYszGEYrr1qLPEsPyiCMuDmtfYh8",
        NFTokenTaxon: 10745,
        Sequence: 73100228,
      });
    });

    it("parses nftokenID with unsigned sequence", function () {
      const nftokenID = "00081388BE9E48FA0E6C95A3E970EB9503E3D3967E8DF95041FED82604D933AB";
      const result: any = Models.parseNFTokenID(nftokenID);

      expect(result).to.eql({
        NFTokenID: nftokenID,
        Flags: 8,
        TransferFee: 5000,
        Issuer: "rJ4urHeGPr69TsC9TY9u8N965AdD7S3XEY",
        NFTokenTaxon: 96,
        Sequence: 81343403,
      });
    });
  });

  describe("buildNFTokenID", () => {
    it("build NFTokenID", function () {
      const result: any = Models.buildNFTokenID(11, 3140, "rNCFjv8Ek5oDrNiMJ3pw6eLLFtMjZLJnf2", 146999694, 3429);

      expect(result).to.eql("000B0C4495F14B0E44F78A264E41713C64B5F89242540EE2BC8B858E00000D65");
    });
  });

  describe("parseNFTokenBurn", () => {
    it("works", function () {
      const tx = require("../examples/responses/NFTokenBurn.json");
      const result: any = Models.parseNFTokenBurn(tx);

      expect(result).to.eql({
        source: { address: "r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3" },
        account: "r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3",
        nftokenID: "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC916E5DA9C00000001",
      });
    });
  });

  describe("parseNFTokenMint", () => {
    it("works", function () {
      const tx = require("../examples/responses/NFTokenMint.json");
      const result: any = Models.parseNFTokenMint(tx);

      expect(result).to.eql({
        source: { address: "r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3" },
        flags: {
          burnable: true,
          onlyXRP: true,
          transferable: true,
          trustLine: false,
        },
        nftokenTaxon: 0,
        uri: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
      });
    });
  });

  describe("parseNFTokenCancelOffer", () => {
    it("works", function () {
      const tx = require("../examples/responses/NFTokenCancelOffer.json");
      const result: any = Models.parseNFTokenCancelOffer(tx);

      expect(result).to.eql({
        source: { address: "r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3" },
        nftokenOffers: ["D3789371E082D2DF4B49AA853E31D3A7E86A1D3B8C5531C160AF5B62AA2B8CA8"],
      });
    });
  });

  describe("parseNFTokenCreateOffer", () => {
    it("works for sell", function () {
      const tx = require("../examples/responses/NFTokenCreateOfferSell.json");
      const result: any = Models.parseNFTokenCreateOffer(tx);

      expect(result).to.eql({
        amount: "1000000000000000",
        flags: {
          sellToken: true,
        },
        nftokenID: "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC90000099B00000000",
        source: { address: "r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3" },
      });
    });

    it("works for buy", function () {
      const tx = require("../examples/responses/NFTokenCreateOfferBuy.json");
      const result: any = Models.parseNFTokenCreateOffer(tx);

      expect(result).to.eql({
        amount: "1",
        flags: {
          sellToken: false,
        },
        owner: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
        nftokenID: "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF16E5DA9C00000001",
        source: { address: "rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw" },
      });
    });
  });

  describe("parseNFTokenAcceptOffer", () => {
    it("works for sell", function () {
      const tx = require("../examples/responses/NFTokenAcceptOfferSell.json");
      const result: any = Models.parseNFTokenAcceptOffer(tx);

      expect(result).to.eql({
        source: { address: "rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw" },
        nftokenSellOffer: "D3C21058E60B6597BCB33A7A77B5FC90959082C96057EDBB388CE365E8D3245D",
      });
    });

    it("works for buy", function () {
      const tx = require("../examples/responses/NFTokenAcceptOfferBuy.json");
      const result: any = Models.parseNFTokenAcceptOffer(tx);

      expect(result).to.eql({
        source: { address: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz" },
        nftokenBuyOffer: "AA12128D6A55784C059FC9654FCBB8904BFCB54C850B2F94046BD9BA2743A021",
      });
    });
  });
});
