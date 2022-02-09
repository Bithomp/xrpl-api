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

    it.skip("works", async function () {
      this.timeout(15000);
      const result: any = await Client.getAccountNftSellOffers(
        "00080000294032DF27EE9718B0E16D5E2EC89550730CCDDD2DCBAB9D00000002"
      );
      expect(result[0]).to.eql({
        amount: "1000000",
        flags: 1,
        index: "98491D03DD3CC3658D99754C05DF26E6FCC0F69719697B85A6587CBD1455F387",
        owner: "rhmfc7GZAJ9j2HuPwBwqCoAJZPai8noFhA",
      });
    });
  });

  describe("getAccountNftBuyOffers", () => {
    before(async function () {
      Client.setup(nconf.get("xrpl:connections:xls20net"));
      await Client.connect();
    });

    it.skip("works", async function () {
      this.timeout(15000);
      const result: any = await Client.getAccountNftBuyOffers(
        "00080000294032DF27EE9718B0E16D5E2EC89550730CCDDD44B17C9E00000003"
      );
      expect(result[0]).to.eql({
        amount: "1000000",
        flags: 0,
        index: "8FC4CA005C0E67050929452CE174300DF3880556E464FAF48B30446BDAF2A26E",
        owner: "rMT4oxZyhN8rWMtJbnqRtpkiGmzWDnqwnF",
      });
    });
  });

  describe("parseNFTokenFlags", () => {
    it("parses flags", async function () {
      const result: any = await Client.parseNFTokenFlags(2147483659);
      expect(result).to.eql({
        burnable: true,
        onlyXRP: true,
        transferable: true,
        trustLine: false,
      });
    });
  });
});
