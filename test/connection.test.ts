import nconf from "nconf";
import { expect } from "chai";

import { Connection } from "../src/connection";
import { Client } from "../src/index";
import { sleep } from "../src/common/utils";

describe("Connection", () => {
  describe("mainnet", () => {
    let connection: Connection;

    before(async function () {
      // three is no need to connect to use global Client
      await Client.disconnect();
    });

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

      it.skip("can subscribe and receive manifest", function (done) {
        expect(connection.streams).to.eql({ ledger: 1 });

        connection.request({
          command: "subscribe",
          streams: ["manifests"],
        });

        expect(connection.streams).to.eql({ ledger: 1, manifests: 1 });

        // {
        //   manifest: '24000000017121ED27AB698D6A96C3578060BA3CD16AB4C1016911156CA04D76AB1D43E3558202AD732103A72EEAD95D6E8BE295C6C0E822A07F45F1A5D3FCCC187886E702DDE951EFE8327646304402200A71F24BF9DD579F635DF3B85E8035090E5814BC7D3F85CFD758D5AD36D05AA2022067231482CDE6D6E1C6ED243BA85F57EDF05F490E22ED67C02A4609D3A89E8EE4701240EFBD4795D0805681C4F85130A1C3C2962CA930B1D7FD3C6B0121B124B9FFAFD554AF088DF83D3968573AC7C47E722CCA52892C1BC6CBF698CF7BAD789225F205',
        //   master_key: 'nHBeudoVR9KCuDAcmAM3RYtLbyErj8mMesgNFV6Dr9LFGbWPy9p6',
        //   master_signature: 'EFBD4795D0805681C4F85130A1C3C2962CA930B1D7FD3C6B0121B124B9FFAFD554AF088DF83D3968573AC7C47E722CCA52892C1BC6CBF698CF7BAD789225F205',
        //   seq: 1,
        //   signature: '304402200A71F24BF9DD579F635DF3B85E8035090E5814BC7D3F85CFD758D5AD36D05AA2022067231482CDE6D6E1C6ED243BA85F57EDF05F490E22ED67C02A4609D3A89E8EE4',
        //   signing_key: 'n9Mk1XBGPV4NdRb1YvuW5hAMQhoD5KFkAahoKRqRPSALapoQreQP',
        //   type: 'manifestReceived'
        // }
        connection.once("manifestReceived", (manifestStream) => {
          expect(manifestStream.type).to.eq("manifestReceived");
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
