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

  describe("parseNFTokenBurn", () => {
    it("works", function () {
      const tx = require("../examples/responses/NFTokenBurn.json");
      const result: any = Client.parseNFTokenBurn(tx);

      expect(result).to.eql({
        account: "r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3",
        tokenID: "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC916E5DA9C00000001",
      });
    });
  });

  describe("parseNFTokenMint", () => {
    it("works", function () {
      const tx = require("../examples/responses/NFTokenMint.json");
      const result: any = Client.parseNFTokenMint(tx);

      expect(result).to.eql({
        flags: {
          burnable: true,
          onlyXRP: true,
          transferable: true,
          trustLine: false,
        },
        tokenTaxon: 0,
        uri: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
      });
    });
  });

  describe("parseNFTokenCancelOffer", () => {
    it("works", function () {
      const tx = require("../examples/responses/NFTokenCancelOffer.json");
      const result: any = Client.parseNFTokenCancelOffer(tx);

      expect(result).to.eql({
        tokenOffers: ["D3789371E082D2DF4B49AA853E31D3A7E86A1D3B8C5531C160AF5B62AA2B8CA8"],
      });
    });
  });

  describe("parseNFTokenCreateOffer", () => {
    it("works for sell", function () {
      const tx = require("../examples/responses/NFTokenCreateOfferSell.json");
      const result: any = Client.parseNFTokenCreateOffer(tx);

      expect(result).to.eql({
        amount: "1000000000000000",
        flags: {
          sellToken: true,
        },
        tokenID: "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC90000099B00000000",
      });
    });

    it("works for buy", function () {
      const tx = require("../examples/responses/NFTokenCreateOfferBuy.json");
      const result: any = Client.parseNFTokenCreateOffer(tx);

      expect(result).to.eql({
        amount: "1",
        flags: {
          sellToken: false,
        },
        owner: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
        tokenID: "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF16E5DA9C00000001",
      });
    });
  });

  describe("parseNFTokenAcceptOffer", () => {
    it("works for sell", function () {
      const tx = require("../examples/responses/NFTokenAcceptOfferSell.json");
      const result: any = Client.parseNFTokenAcceptOffer(tx);

      expect(result).to.eql({
        sellOffer: "D3C21058E60B6597BCB33A7A77B5FC90959082C96057EDBB388CE365E8D3245D",
      });
    });

    it("works for buy", function () {
      const tx = require("../examples/responses/NFTokenAcceptOfferBuy.json");
      const result: any = Client.parseNFTokenAcceptOffer(tx);

      expect(result).to.eql({
        buyOffer: "AA12128D6A55784C059FC9654FCBB8904BFCB54C850B2F94046BD9BA2743A021",
      });
    });
  });

  describe("parseNonFungibleTokenChanges", () => {
    it("NFTokenMint", function () {
      const tx = require("../examples/responses/NFTokenMint.json");
      const result: any = Client.parseNonFungibleTokenChanges(tx);

      expect(result).to.eql({
        r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3: [
          {
            status: "added",
            tokenID: "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC90000099B00000000",
            uri: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
          },
        ],
      });
    });

    it("NFTokenBurn", function () {
      const tx = require("../examples/responses/NFTokenBurn.json");
      const result: any = Client.parseNonFungibleTokenChanges(tx);

      expect(result).to.eql({
        r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3: [
          {
            status: "removed",
            tokenID: "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC916E5DA9C00000001",
            uri: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
          },
        ],
      });
    });

    it("NFTokenAcceptOfferSell", function () {
      const tx = require("../examples/responses/NFTokenAcceptOfferSell.json");
      const result: any = Client.parseNonFungibleTokenChanges(tx);

      expect(result).to.eql({
        rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw: [
          {
            status: "added",
            tokenID: "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC90000099B00000000",
            uri: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
          },
        ],
        r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3: [
          {
            status: "removed",
            tokenID: "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC90000099B00000000",
          },
        ],
      });
    });

    it("NFTokenAcceptOfferBuy", function () {
      const tx = require("../examples/responses/NFTokenAcceptOfferBuy.json");
      const result: any = Client.parseNonFungibleTokenChanges(tx);

      // rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz;

      expect(result).to.eql({
        rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz: [
          {
            status: "removed",
            tokenID: "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF16E5DA9C00000001",
            uri: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
          },
        ],
        rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw: [
          {
            status: "added",
            tokenID: "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF16E5DA9C00000001",
          },
        ],
      });
    });

    it("NFTokenCreateOfferSell", function () {
      const tx = require("../examples/responses/NFTokenCreateOfferSell.json");
      const result: any = Client.parseNonFungibleTokenChanges(tx);

      expect(result).to.eql({});
    });

    it("NFTokenCreateOfferBuy", function () {
      const tx = require("../examples/responses/NFTokenCreateOfferBuy.json");
      const result: any = Client.parseNonFungibleTokenChanges(tx);

      expect(result).to.eql({});
    });

    it("NFTokenCancelOffer", function () {
      const tx = require("../examples/responses/NFTokenCancelOffer.json");
      const result: any = Client.parseNonFungibleTokenChanges(tx);

      expect(result).to.eql({});
    });
  });

  describe("parseNonFungibleTokenOfferChanges", () => {
    it("NFTokenMint", function () {
      const tx = require("../examples/responses/NFTokenMint.json");
      const result: any = Client.parseNonFungibleTokenOfferChanges(tx);

      expect(result).to.eql({});
    });

    it("NFTokenBurn", function () {
      const tx = require("../examples/responses/NFTokenBurn.json");
      const result: any = Client.parseNonFungibleTokenOfferChanges(tx);

      expect(result).to.eql({});
    });

    it("NFTokenCancelOffer", function () {
      const tx = require("../examples/responses/NFTokenCancelOffer.json");
      const result: any = Client.parseNonFungibleTokenOfferChanges(tx);

      expect(result).to.eql({
        r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3: [
          {
            status: "deleted",
            Owner: "r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3",
            amount: "1000000000000000",
            flags: 1,
            tokenID: "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC90000099B00000000",
          },
        ],
      });
    });

    it("NFTokenCreateOfferSell", function () {
      const tx = require("../examples/responses/NFTokenCreateOfferSell.json");
      const result: any = Client.parseNonFungibleTokenOfferChanges(tx);

      expect(result).to.eql({
        r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3: [
          {
            status: "created",
            Owner: "r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3",
            amount: "1000000000000000",
            flags: 1,
            tokenID: "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC90000099B00000000",
          },
        ],
      });
    });

    it("NFTokenCreateOfferBuy", function () {
      const tx = require("../examples/responses/NFTokenCreateOfferBuy.json");
      const result: any = Client.parseNonFungibleTokenOfferChanges(tx);

      expect(result).to.eql({
        rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw: [
          {
            status: "created",
            Owner: "rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw",
            amount: "1",
            tokenID: "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF16E5DA9C00000001",
          },
        ],
      });
    });

    it("NFTokenAcceptOfferSell", function () {
      const tx = require("../examples/responses/NFTokenAcceptOfferSell.json");
      const result: any = Client.parseNonFungibleTokenOfferChanges(tx);

      expect(result).to.eql({
        r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3: [
          {
            status: "deleted",
            Owner: "r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3",
            amount: "0",
            flags: 1,
            tokenID: "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC90000099B00000000",
          },
        ],
      });
    });

    it("NFTokenAcceptOfferBuy", function () {
      const tx = require("../examples/responses/NFTokenAcceptOfferBuy.json");
      const result: any = Client.parseNonFungibleTokenOfferChanges(tx);

      expect(result).to.eql({
        rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw: [
          {
            status: "deleted",
            Owner: "rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw",
            amount: "1",
            flags: 0,
            tokenID: "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF16E5DA9C00000001",
          },
        ],
      });
    });
  });
});
