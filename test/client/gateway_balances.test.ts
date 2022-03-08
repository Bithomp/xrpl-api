import nconf from "nconf";
import { expect } from "chai";
import { Client } from "../../src/index";

describe("Client", () => {
  describe("getBalanceSheet", () => {
    before(async function () {
      Client.setup(nconf.get("xrpl:connections:mainnet"));
      await Client.connect();
    });

    it("works", async function () {
      const result: any = await Client.getBalanceSheet("rBithomp3UNknnjo8HKNfyS5MN4kdPTZpW");
      expect(parseFloat(result.obligations.BTH)).to.gt(0);
    });
  });
});
