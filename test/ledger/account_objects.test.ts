import nconf from "nconf";
import { expect } from "chai";
import { Client } from "../../src/index";

describe("Client", () => {
  describe("getAccountObjects", () => {
    before(async function () {
      this.timeout(15000);
      Client.setup(nconf.get("xrpl:connections:testnet"), { nativeCurrency: "XRP" });
      await Client.connect();
    });

    it("works", async function () {
      const result: any = await Client.getAccountObjects("rHSeZUD5XGjRWq5f1p3DCC3oAP9sg2pgg8");
      expect(Object.keys(result)).to.eql(["account", "account_objects", "ledger_hash", "ledger_index", "validated"]);
      expect(JSON.stringify(result.account_objects)).to.eql(
        '[{"Balance":{"currency":"FOO","issuer":"rrrrrrrrrrrrrrrrrrrrBZbvji","value":"-123.45"},"Flags":131072,"HighLimit":{"currency":"FOO","issuer":"rHSeZUD5XGjRWq5f1p3DCC3oAP9sg2pgg8","value":"1000000000"},"HighNode":"0","LedgerEntryType":"RippleState","LowLimit":{"currency":"FOO","issuer":"rESkTa8rXUGKs1njRrJGYSTwB5R1XYCEAt","value":"0"},"LowNode":"0","PreviousTxnID":"AF70FD60A6B535152E3188F4F5DC504AF44DDEC08534AEDBD7203E59EEADC706","PreviousTxnLgrSeq":8214,"index":"B3640F185360BA74AE095111422699F02B7408C6B26A743216ABC65840D0E27F"}]'
      );
    });
  });

  describe("getAccountAllObjects", () => {
    before(async function () {
      this.timeout(15000);
      Client.setup(nconf.get("xrpl:connections:mainnet"), { nativeCurrency: "XRP" });
      await Client.connect();
    });

    it("works", async function () {
      this.timeout(240000);
      const result: any = await Client.getAccountAllObjects("rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B");
      expect(Object.keys(result).sort()).to.eql([
        "account",
        "account_objects",
        "ledger_hash",
        "ledger_index",
        "limit",
        "validated",
      ]);
      expect(result.account_objects.length).to.gt(500);
    });

    it("works with limit 50", async function () {
      const result: any = await Client.getAccountAllObjects("rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B", { limit: 50 });
      delete result._nodepref; // can be omitted
      expect(Object.keys(result).sort()).to.eql([
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
      delete result._nodepref; // can be omitted
      expect(Object.keys(result).sort()).to.eql([
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
      delete result._nodepref; // can be omitted
      expect(Object.keys(result).sort()).to.eql([
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
      delete result._nodepref; // can be omitted
      expect(Object.keys(result).sort()).to.eql([
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
      this.timeout(15000);
      Client.setup(nconf.get("xrpl:connections:testnet"), { nativeCurrency: "XRP" });
      await Client.connect();
    });

    it("works", async function () {
      const result: any = await Client.getAccountLinesObjects("rHSeZUD5XGjRWq5f1p3DCC3oAP9sg2pgg8");
      expect(Object.keys(result)).to.eql(["account", "ledger_hash", "ledger_index", "validated", "lines"]);
      expect(result.lines).to.eql([
        {
          account: "rESkTa8rXUGKs1njRrJGYSTwB5R1XYCEAt",
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
      this.timeout(15000);
      Client.setup(nconf.get("xrpl:connections:testnet"), { nativeCurrency: "XRP" });
      await Client.connect();
    });

    it("works for buy", async function () {
      const result: any = await Client.getAccountNFTOffersObjects("rN6tv3mZtnvjfDWdyvR47uwP4uEi2HuVKM");

      expect(Object.keys(result)).to.eql(["account", "ledger_hash", "ledger_index", "validated", "nft_offers"]);
      expect(result.nft_offers).to.eql([
        {
          amount: "3000000",
          flags: 0,
          index: "E3E5D27670290E8EFF64C23EA0F00FE26EAB6EC86D4EF2DC5D82CD9698EF1054",
          ledger_index: 15581,
          nft_id: "000B0000F1475F5D5FFB1E867825D2C11C78CBDCC4EF676506A7E2A800003C0D",
          owner: "rN6tv3mZtnvjfDWdyvR47uwP4uEi2HuVKM",
          transaction_hash: "C4BC1F6334BF92DEF98C6779DD4AA2127A9426B29A83EABD629515DD1C7CE62C",
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
          index: "8F5547F1AFD835A36C13D01D1C0F2E5D1F886FBAE122DBAE591F64A861742EE0",
          ledger_index: 15579,
          nft_id: "000B0000F1475F5D5FFB1E867825D2C11C78CBDCC4EF676506A7E2A800003C0D",
          owner: "r4zmMHH32XVDhGo8V2dFPZRJexKZc9YDUh",
          transaction_hash: "2607C20AF02367AD9FB6323F7B809097E0AB05845A6FE4FD682EC8407F5CF1B3",
        },
      ]);
    });
  });

  describe("getAccountURITokensObjects", () => {
    before(async function () {
      this.timeout(15000);
      Client.setup(nconf.get("xrpl:connections:beta"), { nativeCurrency: "XAH" });
      await Client.connect();
    });

    it("works", async function () {
      const result: any = await Client.getAccountURITokensObjects("rGjLQjWZ1vRPzdqPXQM4jksdKQE8oRNd8T");
      expect(Object.keys(result)).to.eql(["account", "ledger_hash", "ledger_index", "validated", "uritokens"]);
      expect(result.uritokens).to.eql([
        {
          flags: 0,
          index: "DB30404B34D1FEDCA500BD84F8A9AC77F18036A1E8966766BDE33595FC41CE57",
          issuer: "r3Q5KufJdkQyaLvHD22fJFVSZCqq4GczyU",
          ledger_index: 4722790,
          owner: "rGjLQjWZ1vRPzdqPXQM4jksdKQE8oRNd8T",
          transaction_hash: "9FFF77CEA7B0A61452E0E6560C6AD1DECFA7DE78DDAB6567E10C54B5547371F8",
          uri: "68747470733A2F2F692E6B796D2D63646E2E636F6D2F656E74726965732F69636F6E732F6F726967696E616C2F3030302F3032372F3437352F53637265656E5F53686F745F323031382D31302D32355F61745F31312E30322E31355F414D2E706E67",
        },
      ]);
    });
  });
});
