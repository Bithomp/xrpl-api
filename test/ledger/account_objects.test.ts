import nconf from "nconf";
import { expect } from "chai";
import { Client } from "../../src/index";

describe("Client", () => {
  describe("getAccountObjects", () => {
    before(async function () {
      Client.setup(nconf.get("xrpl:connections:testnet"));
      await Client.connect();
    });

    it("works", async function () {
      const result: any = await Client.getAccountObjects("rLRUyXNh6QNmkdR1xJrnJBGURQeNp9Ltyf");
      expect(Object.keys(result)).to.eql(["account", "account_objects", "ledger_hash", "ledger_index", "validated"]);
      expect(JSON.stringify(result.account_objects)).to.eql(
        '[{"Balance":{"currency":"FOO","issuer":"rrrrrrrrrrrrrrrrrrrrBZbvji","value":"-123.45"},"Flags":131072,"HighLimit":{"currency":"FOO","issuer":"rLRUyXNh6QNmkdR1xJrnJBGURQeNp9Ltyf","value":"1000000000"},"HighNode":"0","LedgerEntryType":"RippleState","LowLimit":{"currency":"FOO","issuer":"rNTvdxPWujQn2sUXYBGxmWrGe4ethkLyhb","value":"0"},"LowNode":"0","PreviousTxnID":"682BC63E6B3A17304301D921383516F4EF5F4A521B170EAF8492486B21D638FD","PreviousTxnLgrSeq":22442930,"index":"7A130F5FC6D937B65545220DC483B918A4A137D918EF2F126ECD4CBBFE44A633"}]'
      );
    });
  });

  describe("getAccountLinesObjects", () => {
    before(async function () {
      Client.setup(nconf.get("xrpl:connections:testnet"));
      await Client.connect();
    });

    it("works", async function () {
      const result: any = await Client.getAccountLinesObjects("rLRUyXNh6QNmkdR1xJrnJBGURQeNp9Ltyf");
      expect(Object.keys(result)).to.eql(["account", "ledger_hash", "ledger_index", "validated", "lines"]);
      expect(result.lines).to.eql([
        {
          account: "rNTvdxPWujQn2sUXYBGxmWrGe4ethkLyhb",
          balance: "123.45",
          currency: "FOO",
          limit: "1000000000",
          limit_peer: "0",
          no_ripple: false,
          no_ripple_peer: false,
        },
      ]);
    });
  });
});
