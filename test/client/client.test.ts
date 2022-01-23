import nconf from "nconf";
import { expect } from "chai";
import { Client, Wallet } from "../../src/index";

describe("Client", () => {
  describe("getFeeAsync", () => {
    before(async function () {
      Client.setup(nconf.get("xrpl:connections:testnet"));
      await Client.connect();
    });

    it("returns fee", async function () {
      expect(await Client.getFeeAsync()).to.eql("0.000013");
    });
  });
});
