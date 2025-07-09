import nconf from "nconf";
import { expect } from "chai";
import { Client } from "../../src/index";

describe("Client", () => {
  describe("getAccountLines", () => {
    before(async function () {
      this.timeout(15000);
      Client.setup(nconf.get("xrpl:connections:testnet"), { nativeCurrency: "XRP" });
      await Client.connect();
    });

    it("works", async function () {
      const result: any = await Client.getAccountLines("rHSeZUD5XGjRWq5f1p3DCC3oAP9sg2pgg8");
      expect(Object.keys(result)).to.eql(["account", "ledger_hash", "ledger_index", "lines", "validated"]);
      expect(result.lines).to.eql([
        {
          account: "rESkTa8rXUGKs1njRrJGYSTwB5R1XYCEAt",
          balance: "123.45",
          currency: "FOO",
          limit: "1000000000",
          limit_peer: "0",
          quality_in: 0,
          quality_out: 0,
        },
      ]);
    });

    it("works with issuer existing", async function () {
      const result: any = await Client.getAccountLines("rHSeZUD5XGjRWq5f1p3DCC3oAP9sg2pgg8", { currency: "FOO" });
      expect(Object.keys(result)).to.eql(["account", "ledger_hash", "ledger_index", "lines", "validated"]);
      expect(result.lines).to.eql([
        {
          account: "rESkTa8rXUGKs1njRrJGYSTwB5R1XYCEAt",
          balance: "123.45",
          currency: "FOO",
          limit: "1000000000",
          limit_peer: "0",
          quality_in: 0,
          quality_out: 0,
        },
      ]);
    });

    it("works with not existing issuer", async function () {
      const result: any = await Client.getAccountLines("rHSeZUD5XGjRWq5f1p3DCC3oAP9sg2pgg8", { currency: "DOO" });
      expect(Object.keys(result)).to.eql(["account", "ledger_hash", "ledger_index", "lines", "validated"]);
      expect(result.lines).to.eql([]);
    });

    it("works with currency existing", async function () {
      const result: any = await Client.getAccountLines("rHSeZUD5XGjRWq5f1p3DCC3oAP9sg2pgg8", {
        issuer: "rESkTa8rXUGKs1njRrJGYSTwB5R1XYCEAt",
      });
      expect(Object.keys(result)).to.eql(["account", "ledger_hash", "ledger_index", "lines", "validated"]);
      expect(result.lines).to.eql([
        {
          account: "rESkTa8rXUGKs1njRrJGYSTwB5R1XYCEAt",
          balance: "123.45",
          currency: "FOO",
          limit: "1000000000",
          limit_peer: "0",
          quality_in: 0,
          quality_out: 0,
        },
      ]);
    });

    it("works with not existing currency", async function () {
      const result: any = await Client.getAccountLines("rHSeZUD5XGjRWq5f1p3DCC3oAP9sg2pgg8", {
        issuer: "rHSeZUD5XGjRWq5f1p3DCC3oAP9sg2pgg8",
      });
      expect(Object.keys(result)).to.eql(["account", "ledger_hash", "ledger_index", "lines", "validated"]);
      expect(result.lines).to.eql([]);
    });
  });
});
