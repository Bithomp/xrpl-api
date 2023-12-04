import nconf from "nconf";
import { expect } from "chai";
import { Client } from "../../src/index";

describe("Client", () => {
  describe("getFee", () => {
    before(async function () {
      this.timeout(15000);
      Client.setup(nconf.get("xrpl:connections:testnet"), { nativeCurrency: "XRP" });
      await Client.connect();
    });

    it("returns fee", async function () {
      expect(await Client.getFee()).to.eql("0.000013");
    });
  });
});
