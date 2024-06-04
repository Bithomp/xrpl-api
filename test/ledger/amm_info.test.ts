import nconf from "nconf";
import { expect } from "chai";
import { Client } from "../../src/index";

describe("Client", () => {
  describe("mainnet", () => {
    before(async function () {
      this.timeout(15000);
      Client.setup(nconf.get("xrpl:connections:mainnet"), { loadBalancing: true, nativeCurrency: "XRP" });
      await Client.connect();
    });

    describe("getAmmInfo", () => {
      it("works by amm account", async function () {
        const result: any = await Client.getAmmInfo("rGHt6LT5v9DVaEAmFzj5ciuxuj41ZjLofs");
        delete result._nodepref; // can be omitted
        expect(Object.keys(result).sort()).to.eql(["amm", "ledger_hash", "ledger_index", "validated"]);
        expect(Object.keys(result.amm).sort()).to.eql([
          "account",
          "amount",
          "amount2",
          "asset2_frozen",
          "auction_slot",
          "lp_token",
          "trading_fee",
          "vote_slots",
        ]);
      });

      it("works by amm assets", async function () {
        const result: any = await Client.getAmmInfoByAssets(
          { currency: "XRP" },
          { currency: "5553444300000000000000000000000000000000", issuer: "rcEGREd8NmkKRE8GE424sksyt1tJVFZwu" }
        );
        delete result._nodepref; // can be omitted
        expect(Object.keys(result).sort()).to.eql(["amm", "ledger_hash", "ledger_index", "validated"]);
        expect(Object.keys(result.amm).sort()).to.eql([
          "account",
          "amount",
          "amount2",
          "asset2_frozen",
          "auction_slot",
          "lp_token",
          "trading_fee",
          "vote_slots",
        ]);
      });
    });
  });
});
