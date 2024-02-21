import _ from "lodash";
import nconf from "nconf";
import { expect } from "chai";
import { Client, Wallet } from "../../src/index";

describe("Client", () => {
  describe("mainnet", () => {
    before(async function () {
      this.timeout(15000);
      Client.setup(nconf.get("xrpl:connections:mainnet"), { loadBalancing: true, nativeCurrency: "XRP" });
      await Client.connect();
    });

    describe("getBookOffers", () => {
      it("returns offers", async function () {
        const taker = "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z";
        const takerGets = {
          currency: "USD",
          issuer: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
        };
        const takerPays = {
          currency: "BTC",
          issuer: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
        };

        const result: any = await Client.getBookOffers(taker, takerGets, takerPays);
        const offer = result.offers[0];

        expect(_.without(Object.keys(offer), "taker_gets_funded", "taker_pays_funded")).to.eql([
          "Account",
          "BookDirectory",
          "BookNode",
          "Flags",
          "LedgerEntryType",
          "OwnerNode",
          "PreviousTxnID",
          "PreviousTxnLgrSeq",
          "Sequence",
          "TakerGets",
          "TakerPays",
          "index",
          "owner_funds",
          "quality",
        ]);
      });

      it("returns offers with limit", async function () {
        const taker = "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z";
        const takerGets = {
          currency: "USD",
          issuer: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
        };
        const takerPays = {
          currency: "BTC",
          issuer: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
        };

        const result: any = await Client.getBookOffers(taker, takerGets, takerPays, { limit: 1 });

        delete result._nodepref;
        delete result.warnings;
        delete result.validated; // could be missing
        expect(Object.keys(result)).to.eql(["ledger_hash", "ledger_index", "offers"]);
        expect(result.offers.length).to.eq(1);
      });
    });

    describe("getOrderbook", () => {
      it("returns offers", async function () {
        this.timeout(10000);
        const taker = "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z";
        const orderbook = {
          base: {
            currency: "USD",
            counterparty: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          },
          counter: {
            currency: "BTC",
            counterparty: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          },
        };

        const result: any = await Client.getOrderbook(taker, orderbook);
        expect(Object.keys(result)).to.eql(["bids", "asks"]);
        delete result.bids[0].state;
        expect(Object.keys(result.bids[0])).to.eql(["specification", "properties", "data"]);
        delete result.bids[0].data.taker_gets_funded;
        delete result.bids[0].data.taker_pays_funded;
        expect(Object.keys(result.bids[0].data)).to.eql([
          "Account",
          "BookDirectory",
          "BookNode",
          "Flags",
          "LedgerEntryType",
          "OwnerNode",
          "PreviousTxnID",
          "PreviousTxnLgrSeq",
          "Sequence",
          "TakerGets",
          "TakerPays",
          "index",
          "owner_funds",
          "quality",
        ]);

        delete result.asks[0].state;
        expect(Object.keys(result.asks[0])).to.eql(["specification", "properties", "data"]);
        delete result.asks[0].data.taker_gets_funded;
        delete result.asks[0].data.taker_pays_funded;

        expect(Object.keys(result.asks[0].data)).to.eql([
          "Account",
          "BookDirectory",
          "BookNode",
          "Flags",
          "LedgerEntryType",
          "OwnerNode",
          "PreviousTxnID",
          "PreviousTxnLgrSeq",
          "Sequence",
          "TakerGets",
          "TakerPays",
          "index",
          "owner_funds",
          "quality",
        ]);
      });

      it("returns error", async function () {
        const taker = Wallet.generateAddress().address;
        const orderbook = {
          base: {
            currency: "",
            counterparty: "",
          },
          counter: {
            currency: "",
            counterparty: "",
          },
        };
        const result: any = await Client.getOrderbook(taker, orderbook);

        expect(Object.keys(result)).to.eql(["taker", "error", "error_code", "error_message", "status", "validated"]);
        expect(result.taker).to.eql(taker);
        expect(result.status).to.eql("error");
        expect(["srcIsrMalformed", "dstIsrMalformed"].includes(result.error)).to.eq(true);
        expect([70, 53].includes(result.error_code)).to.eq(true);

        // error_message: "Invalid field 'taker_pays.issuer', bad issuer.",
        // delete result.error_message; // could be different, depending on server

        // expect(result).to.eql({
        //   error: "srcIsrMalformed",
        //   error_code: 70,
        //   status: "error",
        //   taker,
        //   validated: undefined,
        // });
        // expect(result).to.eql({
        //   error: "dstIsrMalformed",
        //   error_code: 53,
        //   status: "error",
        //   taker,
        //   validated: undefined,
        // });
      });
    });
  });
});
