import nconf from "nconf";
import { expect } from "chai";
import { Client } from "../../src/index";

describe("Client", () => {
  describe("getTrustlines", () => {
    before(async function () {
      Client.setup(nconf.get("xrpl:connections:testnet"));
      await Client.connect();
    });

    it("works", async function () {
      const result: any = await Client.getTrustlines("rLRUyXNh6QNmkdR1xJrnJBGURQeNp9Ltyf");
      expect(result).to.eql([
        {
          account: "rNTvdxPWujQn2sUXYBGxmWrGe4ethkLyhb",
          balance: "123.45",
          currency: "FOO",
          limit: "1000000000",
          limit_peer: "0",
          no_ripple: false,
          no_ripple_peer: false,
          quality_in: 0,
          quality_out: 0,
        },
      ]);
    });
  });
});
