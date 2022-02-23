import nconf from "nconf";
import { expect } from "chai";
import { Client } from "../../src/index";

describe("Client", () => {
  describe("getAccountNfts", () => {
    before(async function () {
      Client.setup(nconf.get("xrpl:connections:xls20net"));
      await Client.connect();
    });

    it("works", async function () {
      const result: any = await Client.getAccountNfts("rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz");
      expect(result).to.eql([
        {
          Flags: 0,
          Issuer: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
          TokenID: "00000000C124E14881533A9AFE4A5F481795C17003A9FACF0000099B00000000",
          TokenTaxon: 0,
          URI: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
          nft_serial: 0,
        },
        {
          Flags: 0,
          Issuer: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
          TokenID: "00000000C124E14881533A9AFE4A5F481795C17003A9FACF16E5DA9C00000001",
          TokenTaxon: 0,
          URI: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
          nft_serial: 1,
        },
        {
          Flags: 0,
          Issuer: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
          TokenID: "00000000C124E14881533A9AFE4A5F481795C17003A9FACF2DCBAB9D00000002",
          TokenTaxon: 0,
          URI: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
          nft_serial: 2,
        },
        {
          Flags: 11,
          Issuer: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
          TokenID: "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF44B17C9E00000003",
          TokenTaxon: 0,
          URI: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
          nft_serial: 3,
        },
        {
          Flags: 11,
          Issuer: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
          TokenID: "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF5B974D9F00000004",
          TokenTaxon: 0,
          URI: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
          nft_serial: 4,
        },
        {
          Flags: 0,
          Issuer: "rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw",
          TokenID: "00000000DCBED2CF425AFDA5095FDD3633E5E89DE0D485D80000099B00000000",
          TokenTaxon: 0,
          URI: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
          nft_serial: 0,
        },
      ]);
    });
  });

  describe("getAccountNftSellOffers", () => {
    before(async function () {
      Client.setup(nconf.get("xrpl:connections:xls20net"));
      await Client.connect();
    });

    it("works", async function () {
      this.timeout(15000);
      const result: any = await Client.getAccountNftSellOffers(
        "00000000C124E14881533A9AFE4A5F481795C17003A9FACF0000099B00000000"
      );
      expect(result[0]).to.eql({
        amount: "1000000000000000",
        flags: 1,
        index: "A38DDBC95D49A8490BC867094FE96616FADC4F784B3E4F89EAF6DBB8459FAA02",
        owner: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
      });
    });
  });

  describe("getAccountNftBuyOffers", () => {
    before(async function () {
      Client.setup(nconf.get("xrpl:connections:xls20net"));
      await Client.connect();
    });

    it("works", async function () {
      this.timeout(15000);
      const result: any = await Client.getAccountNftBuyOffers(
        "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF44B17C9E00000003"
      );
      expect(result[0]).to.eql({
        amount: "1000000",
        flags: 0,
        index: "18D7B7B33A566997638B6C7A58266DB647C669C0B28655B42702A4B5A967316A",
        owner: "rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw",
      });
    });
  });

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
