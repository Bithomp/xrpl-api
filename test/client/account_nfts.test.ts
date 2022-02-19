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
      this.timeout(15000);
      const result: any = await Client.getAccountNfts("rhmfc7GZAJ9j2HuPwBwqCoAJZPai8noFhA");
      expect(result[0].Issuer).to.eql("rhmfc7GZAJ9j2HuPwBwqCoAJZPai8noFhA");
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
});
