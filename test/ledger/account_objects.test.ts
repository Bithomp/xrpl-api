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

  describe("getAccountAllObjects", () => {
    before(async function () {
      Client.setup(nconf.get("xrpl:connections:testnet"));
      await Client.connect();
    });

    it("works", async function () {
      const result: any = await Client.getAccountAllObjects("rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B");
      expect(Object.keys(result)).to.eql(["account", "account_objects", "ledger_hash", "ledger_index", "validated"]);
      expect(result.account_objects.length).to.gt(500);
    });

    it("works with limit 50", async function () {
      const result: any = await Client.getAccountAllObjects("rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B", { limit: 50 });
      expect(Object.keys(result)).to.eql([
        "account",
        "account_objects",
        "ledger_hash",
        "ledger_index",
        "limit",
        "marker",
        "validated",
      ]);
      expect(result.limit).to.eq(50);
      expect(result.marker).to.not.eq(undefined);
      expect(result.marker).to.be.a("string");
      expect(result.account_objects.length).to.eq(50);
    });

    it("works with limit and marker", async function () {
      const result1: any = await Client.getAccountAllObjects("rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B", { limit: 200 });
      expect(result1.marker).to.be.a("string");

      const result2: any = await Client.getAccountAllObjects("rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B", {
        limit: 200,
        marker: result1.marker,
      });

      expect(result2.marker).to.be.a("string");
      expect(result2.marker).to.not.eq(result1.marker);

      const result1Indexes = result1.account_objects.map((obj: any) => obj.index);
      const result2Indexes = result2.account_objects.map((obj: any) => obj.index);
      expect(result1Indexes).to.not.include.members(result2Indexes);
    });

    it("works with limit 500", async function () {
      const result: any = await Client.getAccountAllObjects("rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B", { limit: 500 });
      expect(Object.keys(result)).to.eql([
        "account",
        "account_objects",
        "ledger_hash",
        "ledger_index",
        "limit",
        "marker",
        "validated",
      ]);
      expect(result.marker).to.not.eq(undefined);
      expect(result.marker).to.be.a("string");
      expect(result.account_objects.length).to.eq(500);
    });

    it("works with limit 401", async function () {
      const result: any = await Client.getAccountAllObjects("rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B", { limit: 401 });
      expect(Object.keys(result)).to.eql([
        "account",
        "account_objects",
        "ledger_hash",
        "ledger_index",
        "limit",
        "marker",
        "validated",
      ]);
      expect(result.marker).to.not.eq(undefined);
      expect(result.marker).to.be.a("string");
      expect(result.account_objects.length).to.eq(401);
    });

    it("works with timeout", async function () {
      const result: any = await Client.getAccountAllObjects("rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B", { timeout: 1 });
      expect(Object.keys(result)).to.eql([
        "account",
        "account_objects",
        "ledger_hash",
        "ledger_index",
        "limit",
        "marker",
        "validated",
      ]);
      expect(result.marker).to.not.eq(undefined);
      expect(result.marker).to.be.a("string");
      expect(result.account_objects.length).to.eq(200);
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

  describe("getAccountNFTOffersObjects", () => {
    before(async function () {
      Client.setup(nconf.get("xrpl:connections:testnet"));
      await Client.connect();
    });

    it("works for buy", async function () {
      const result: any = await Client.getAccountNFTOffersObjects("rN6tv3mZtnvjfDWdyvR47uwP4uEi2HuVKM");

      expect(Object.keys(result)).to.eql(["account", "ledger_hash", "ledger_index", "validated", "nft_offers"]);
      expect(result.nft_offers).to.eql([
        {
          amount: "3000000",
          flags: 0,
          index: "3A3EEF42653BBA9D0756C5A5CEB10E74A95531903661284404914E414E980EE0",
          ledger_index: 34625417,
          nft_id: "000B0000F1475F5D5FFB1E867825D2C11C78CBDCC4EF67650000099B00000000",
          owner: "rN6tv3mZtnvjfDWdyvR47uwP4uEi2HuVKM",
          transaction_hash: "086208948599E016B24FAA892995598ED8FECF2017DC78CAF09A82F44680C283",
        },
      ]);
    });

    it("works for sell", async function () {
      const result: any = await Client.getAccountNFTOffersObjects("r4zmMHH32XVDhGo8V2dFPZRJexKZc9YDUh");

      expect(Object.keys(result)).to.eql(["account", "ledger_hash", "ledger_index", "validated", "nft_offers"]);
      expect(result.nft_offers).to.eql([
        {
          amount: "4000000",
          destination: "rN6tv3mZtnvjfDWdyvR47uwP4uEi2HuVKM",
          flags: 1,
          index: "82962760B13C541370C2B9A2CE0F09AE65117C53CBB9ADB0FB168273253C5A14",
          ledger_index: 34625415,
          nft_id: "000B0000F1475F5D5FFB1E867825D2C11C78CBDCC4EF67650000099B00000000",
          owner: "r4zmMHH32XVDhGo8V2dFPZRJexKZc9YDUh",
          transaction_hash: "C5FDD937F0F5A82A95251A307F154C227FFD54C1E051B0057E56301BD479EBA3",
        },
      ]);
    });
  });
});
