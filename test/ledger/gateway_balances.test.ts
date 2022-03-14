import nconf from "nconf";
import { expect } from "chai";
import { Client } from "../../src/index";

describe("Client", () => {
  describe("getBalanceSheet", () => {
    before(async function () {
      Client.setup(nconf.get("xrpl:connections:mainnet"));
      await Client.connect();
    });

    it("works with obligations", async function () {
      const result: any = await Client.getBalanceSheet("rBithomp3UNknnjo8HKNfyS5MN4kdPTZpW");
      expect(parseFloat(result.obligations.BTH)).to.gt(0);
    });

    it("works with assets", async function () {
      const result: any = await Client.getBalanceSheet("rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z");
      expect(result.assets.rBithomp3UNknnjo8HKNfyS5MN4kdPTZpW[0].currency).to.eq('BTH');
      expect(parseFloat(result.assets.rBithomp3UNknnjo8HKNfyS5MN4kdPTZpW[0].value)).to.gt(0);
    });
  });
});
