import nconf from "nconf";
import { expect } from "chai";
import { Client } from "../../src/index";

describe("Client", () => {
  describe("getAccountLines", () => {
    before(async function () {
      this.timeout(15000);
      Client.setup(nconf.get("xrpl:connections:test-xahau"), { nativeCurrency: "XAH" });
      await Client.connect();
    });

    it("works", async function () {
      const result: any = await Client.getAccountNamespace(
        "rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh",
        "0000000000000000000000000000000000000000000000000000000000000000"
      );
      expect(Object.keys(result)).to.eql([
        "account",
        "ledger_hash",
        "ledger_index",
        "namespace_entries",
        "namespace_id",
        "validated",
      ]);
      expect(result.account).to.eql("rHb9CJAWyB4rj91VRWn96DkukG4bwdtyTh");
      expect(result.namespace_id).to.eql("0000000000000000000000000000000000000000000000000000000000000000");
      expect(result.namespace_entries.length).to.gte(1);
      expect(Object.keys(result.namespace_entries[0])).to.eql([
        "Flags",
        "HookStateData",
        "HookStateKey",
        "LedgerEntryType",
        "OwnerNode",
        "index",
      ]);
    });
  });
});
