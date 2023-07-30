import nconf from "nconf";
import { expect } from "chai";
import { Client } from "../../src/index";

describe("Client", () => {
  describe("getAccountOffers", () => {
    before(async function () {
      this.timeout(15000);
      Client.setup(nconf.get("xrpl:connections:mainnet"), { loadBalancing: true });
      await Client.connect();
    });

    it("works", async function () {
      const result: any = await Client.getAccountOffers("rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z");
      const offer = result.offers[0];

      expect(Object.keys(offer).sort()).to.eql(["flags", "quality", "seq", "taker_gets", "taker_pays"]);
      expect(Object.keys(offer.taker_gets).sort()).to.eql(["currency", "issuer", "value"]);
      expect(Object.keys(offer.taker_pays).sort()).to.eql(["currency", "issuer", "value"]);
    });
  });
});
