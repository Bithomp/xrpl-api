import nconf from "nconf";
import { expect } from "chai";
import { Client } from "../../src/index";

describe("Client", () => {
  describe("mainnet", () => {
    before(async function () {
      this.timeout(15000);
      Client.setup(nconf.get("xrpl:connections:mainnet"));
      await Client.connect();
    });

    describe("getBalanceSheet", () => {
      it("works with obligations", async function () {
        const result: any = await Client.getBalanceSheet("rBithomp3UNknnjo8HKNfyS5MN4kdPTZpW");
        expect(parseFloat(result.obligations.BTH)).to.gt(0);
      });

      it("works with assets", async function () {
        const result: any = await Client.getBalanceSheet("rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z");
        expect(result.assets.rBithomp3UNknnjo8HKNfyS5MN4kdPTZpW[0].currency).to.eq("BTH");
        expect(parseFloat(result.assets.rBithomp3UNknnjo8HKNfyS5MN4kdPTZpW[0].value)).to.gt(0);
      });
    });

    describe("getAccountObligations", () => {
      it("works with obligations", async function () {
        const result: any = await Client.getAccountObligations("rBithomp3UNknnjo8HKNfyS5MN4kdPTZpW");
        delete result._nodepref;
        expect(Object.keys(result)).to.be.eql(["account", "ledger_hash", "ledger_index", "validated", "lines"]);
        expect(result.lines).to.be.eql([
          {
            account: "rBithomp3UNknnjo8HKNfyS5MN4kdPTZpW",
            currency: "BTH",
            balance: "-9999.999",
            limit: "0",
            limit_peer: "0",
            quality_in: 0,
            quality_out: 0,
            obligation: true,
          },
        ]);
      });

      it("works with obligations", async function () {
        const result: any = await Client.getAccountObligations("rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z");
        delete result._nodepref;
        expect(Object.keys(result)).to.be.eql(["account", "ledger_hash", "ledger_index", "validated", "lines"]);
        expect(result.lines).to.be.eql([]);
      });
    });
  });
});
