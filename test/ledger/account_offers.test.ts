import nconf from "nconf";
import { expect } from "chai";
import { Client } from "../../src/index";

describe("Client", () => {
  describe("getAccountOffers", () => {
    before(async function () {
      this.timeout(15000);
      Client.setup(nconf.get("xrpl:connections:mainnet"), { loadBalancing: true, nativeCurrency: "XRP" });
      await Client.connect();
    });

    it("works", async function () {
      const result: any = await Client.getAccountOffers("rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z");
      const offer = result.offers[0];

      expect(Object.keys(offer).sort()).to.eql(["flags", "quality", "seq", "taker_gets", "taker_pays"]);
      expect(Object.keys(offer.taker_gets).sort()).to.eql(["currency", "issuer", "value"]);
      expect(Object.keys(offer.taker_pays).sort()).to.eql(["currency", "issuer", "value"]);
    });

    it("works as formatted", async function () {
      const result: any = await Client.getAccountOffers("rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z", { formatted: true });
      const offer = result.offers[0];

      expect(Object.keys(offer).sort()).to.eql(["properties", "specification"]);
      expect(Object.keys(offer.specification).sort()).to.eql(["direction", "quantity", "totalPrice"]);
    });
  });

  describe("getAccountAllOffers", () => {
    before(async function () {
      this.timeout(15000);
      Client.setup(nconf.get("xrpl:connections:mainnet"), { loadBalancing: true, nativeCurrency: "XRP" });
      await Client.connect();
    });

    it("works with offers", async function () {
      const result: any = await Client.getAccountAllOffers("rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z");
      const offer = result.offers[0];

      expect(Object.keys(offer).sort()).to.eql(["flags", "quality", "seq", "taker_gets", "taker_pays"]);
      expect(Object.keys(offer.taker_gets).sort()).to.eql(["currency", "issuer", "value"]);
      expect(Object.keys(offer.taker_pays).sort()).to.eql(["currency", "issuer", "value"]);
    });

    it("works with no offers", async function () {
      const result: any = await Client.getAccountAllOffers("r4UPddYeGeZgDhSGPkooURsQtmGda4oYQW");
      expect(result.offers.length).to.eql(0);
      expect(result.marker).to.a("string");
    });

    it("works as formatted with offers", async function () {
      const result: any = await Client.getAccountAllOffers("rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z", { formatted: true });
      const offer = result.offers[0];

      expect(Object.keys(offer).sort()).to.eql(["properties", "specification"]);
      expect(Object.keys(offer.specification).sort()).to.eql(["direction", "quantity", "totalPrice"]);
    });

    it("works as formatted with no offers", async function () {
      const result: any = await Client.getAccountAllOffers("r4UPddYeGeZgDhSGPkooURsQtmGda4oYQW", { formatted: true });
      expect(result.offers.length).to.eql(0);
      expect(result.marker).to.a("string");
    });
  });
});
