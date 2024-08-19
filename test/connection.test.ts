import nconf from "nconf";
import { expect } from "chai";

import { Connection } from "../src/connection";
import { Client } from "../src/index";
import { sleep } from "../src/common/utils";

describe("Connection", () => {
  describe("mainnet", () => {
    let connection: Connection;

    beforeEach(async function () {
      this.timeout(15000);
      const server = nconf.get("xrpl:connections:mainnet")[0];
      connection = new Connection(server.url, server.type);
      await connection.connect();
    });

    afterEach(async function () {
      this.timeout(15000);
      await connection.disconnect();
    });

    describe("isConnected", () => {
      it("returns true", function () {
        expect(connection.isConnected()).to.be.true;
      });
    });

    describe("getOnlinePeriodMs", () => {
      it("returns true", async function () {
        await sleep(1000);

        expect(connection.getOnlinePeriodMs()).to.be.greaterThan(1000);
      });
    });

    describe("request", () => {
      it("can receive ledger", function (done) {
        this.timeout(10000);
        expect(connection.streams).to.eql({ ledger: 1 });

        connection.once("ledgerClosed", (ledgerStream) => {
          expect(ledgerStream.type).to.eq("ledgerClosed");
          done();
        });
      });

      it("can subscribe and unsubscribe", async function () {
        expect(connection.streams).to.eql({ ledger: 1 });

        await connection.request({
          command: "subscribe",
          streams: ["transactions"],
        });

        expect(connection.streams).to.eql({ ledger: 1, transactions: 1 });

        await connection.request({
          command: "subscribe",
          streams: ["transactions"],
        });

        expect(connection.streams).to.eql({ ledger: 1, transactions: 2 });

        await connection.request({
          command: "unsubscribe",
          streams: ["transactions"],
        });

        expect(connection.streams).to.eql({ ledger: 1, transactions: 1 });

        await connection.request({
          command: "unsubscribe",
          streams: ["transactions"],
        });

        expect(connection.streams).to.eql({ ledger: 1 });
      });

      it("can subscribe and receive transaction", function (done) {
        this.timeout(10000);
        expect(connection.streams).to.eql({ ledger: 1 });

        connection.request({
          command: "subscribe",
          streams: ["transactions"],
        });

        expect(connection.streams).to.eql({ ledger: 1, transactions: 1 });

        connection.once("transaction", (transactionStream) => {
          expect(transactionStream.type).to.eq("transaction");
          done();
        });
      });

      it("can subscribe and unsubscribe not receive any transaction after", function (done) {
        this.timeout(15000);
        expect(connection.streams).to.eql({ ledger: 1 });

        connection.request({
          command: "subscribe",
          streams: ["transactions"],
        });

        expect(connection.streams).to.eql({ ledger: 1, transactions: 1 });

        connection.request({
          command: "unsubscribe",
          streams: ["transactions"],
        });

        expect(connection.streams).to.eql({ ledger: 1 });

        connection.once("transaction", (transactionStream) => {
          expect(transactionStream.type).not.to.eq("transaction");
        });

        setTimeout(done, 10000);
      });
    });
  });

  describe("testnet", () => {
    let connection: Connection;

    before(async function () {
      this.timeout(15000);
      Client.setup(nconf.get("xrpl:connections:testnet"), { nativeCurrency: "XRP" });
      await Client.connect();
    });

    beforeEach(async function () {
      this.timeout(15000);
      const server = nconf.get("xrpl:connections:testnet")[0];
      connection = new Connection(server.url, server.type);
      await connection.connect();
    });

    afterEach(async function () {
      this.timeout(15000);
      await connection.disconnect();
    });

    it("can subscribe to account and receive transaction", function (done) {
      this.timeout(10000);
      expect(connection.streams).to.eql({ ledger: 1 });
      expect(connection.accounts).to.eql({});

      const account = "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz";
      connection.request({
        command: "subscribe",
        accounts: [account],
      });

      expect(connection.streams).to.eql({ ledger: 1 });
      expect(connection.accounts).to.eql({ [account]: 1 });

      const payment = {
        sourceAddress: account,
        sourceValue: "0.0001",
        sourceCurrency: "XRP",
        destinationAddress: "rBbfoBCNMpAaj35K5A9UV9LDkRSh6ZU9Ef",
        destinationValue: "0.0001",
        destinationCurrency: "XRP",
        memos: [{ type: "memo", format: "plain/text", data: "Bithomp test" }],
        secret: nconf.get("xrpl:accounts:activation:secret"),
      };

      Client.submitPaymentTransactionV1(payment);

      connection.once("transaction", (transactionStream) => {
        expect(transactionStream.type).to.eq("transaction");

        done();
      });
    });
  });
});
