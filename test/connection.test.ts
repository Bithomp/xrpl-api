import { expect } from "chai";
import nconf from "nconf";
// import { expect } from "chai";

import { Connection } from "../src/connection";

let connection: Connection;

describe("Connection", () => {
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

  describe("request", () => {
    it("can receive ledger", function (done) {
      this.timeout(15000);
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
      this.timeout(15000);
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
