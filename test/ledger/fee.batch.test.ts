import assert from "node:assert/strict";
import { encode, XrplDefinitions } from "ripple-binary-codec";
import definitionsJson from "ripple-binary-codec/dist/enums/definitions.json";
import * as Client from "../../src/client";
import { Connection } from "../../src/connection";
import { getFee, getFeeData } from "../../src/ledger/fee";

const account = "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe";
const feeResponse = { result: { drops: { open_ledger_fee: "10" } } };

function batch(count = 2, type = "NFTokenCreateOffer"): any {
  return {
    TransactionType: "Batch",
    Account: account,
    Sequence: 1,
    Fee: "0",
    SigningPubKey: "",
    Flags: 65536,
    RawTransactions: Array.from({ length: count }, (_, index) => ({
      RawTransaction: {
        TransactionType: type,
        Account: account,
        Sequence: index + 2,
        Fee: "0",
        SigningPubKey: "",
        Flags: 1073741824,
      },
    })),
  };
}

function mockConnection(fee: any = feeResponse, serverInfo: any = { validated_ledger: { reserve_inc_xrp: 0.2 } }) {
  const requests: any[] = [];
  const connection = {
    serverInfo,
    getIncrementFee: Connection.prototype.getIncrementFee,
    async request(request: any) {
      requests.push(request);
      assert.equal(request.command, "fee", "Reserve increment must use cached connection data");
      return fee;
    },
  } as unknown as Connection;
  return { connection, requests };
}

describe("Client Batch fees (isolated)", () => {
  const nativeCurrency = Client.getNativeCurrency() === "XAH" ? "XAH" : "XRP";
  const feeCushion = Client.feeCushion;

  beforeEach(() => {
    Client.setup([], { nativeCurrency: "XRP", feeCushion: 1.4 });
  });

  after(() => {
    Client.setup([], { nativeCurrency, feeCushion });
  });

  for (const type of ["NFTokenCreateOffer", "NFTokenAcceptOffer"]) {
    for (const count of [2, 8]) {
      it(`includes overhead and ${count} ${type} fees`, async () => {
        const { connection, requests } = mockConnection();
        const tx = batch(count, type);
        const original = JSON.stringify(tx);
        assert.deepEqual(await getFeeData({ connection, tx }), { fee: count === 2 ? "0.000056" : "0.00014" });
        assert.deepEqual(requests, [{ command: "fee", tx_blob: undefined }]);
        assert.equal(JSON.stringify(tx), original);
      });
    }
  }

  it("uses the current load-adjusted fee and cushion", async () => {
    const { connection } = mockConnection({ result: { drops: { open_ledger_fee: "21" } } });
    assert.equal(await getFee({ connection, tx: batch(8) }), "0.0003");
  });

  it("decodes Batch blobs using the supplied definitions", async () => {
    const definitions = new XrplDefinitions({
      ...definitionsJson,
      TRANSACTION_TYPES: { ...definitionsJson.TRANSACTION_TYPES, Batch: 60000 },
    });
    const { connection, requests } = mockConnection();
    assert.equal(await getFee({ connection, tx: encode(batch(8), definitions), definitions }), "0.00014");
    assert.equal(requests.length, 1);
  });

  it("includes outer multisignatures and single/multisigned BatchSigners", async () => {
    const tx = batch();
    tx.Signers = [{ Signer: {} }, { Signer: {} }];
    tx.BatchSigners = [
      { BatchSigner: { TxnSignature: "AA" } },
      { BatchSigner: { Signers: [{ Signer: {} }, { Signer: {} }] } },
    ];
    const { connection } = mockConnection();
    assert.equal(await getFee({ connection, tx }), "0.000126");
  });

  it("uses the cached increment fee for special inner fees without an extra RPC", async () => {
    const tx = batch(3);
    tx.RawTransactions[0].RawTransaction.TransactionType = "AMMCreate";
    tx.RawTransactions[1].RawTransaction.TransactionType = "AccountDelete";
    tx.RawTransactions[2].RawTransaction = { TransactionType: "EscrowFinish", Fulfillment: "AB".repeat(16) };
    const { connection, requests } = mockConnection();
    assert.equal(await getFee({ connection, tx }), "0.400504");
    assert.deepEqual(requests.map(({ command }) => command), ["fee"]);
  });

  it("reads updated increment fees from the connection in native currency units", async () => {
    const tx = batch();
    tx.RawTransactions[0].RawTransaction.TransactionType = "AMMCreate";
    const { connection, requests } = mockConnection();
    assert.equal(connection.getIncrementFee(), "0.2");
    assert.equal(await getFee({ connection, tx }), "0.200042");

    connection.serverInfo.validated_ledger.reserve_inc_xrp = "0.5";
    assert.equal(connection.getIncrementFee(), "0.5");
    assert.equal(await getFee({ connection, tx }), "0.500042");
    assert.deepEqual(requests.map(({ command }) => command), ["fee", "fee"]);
  });

  it("rounds fractional drops up for conditioned EscrowFinish", async () => {
    const tx = batch();
    tx.RawTransactions[0].RawTransaction = { TransactionType: "EscrowFinish", Fulfillment: "AB" };
    const { connection } = mockConnection();
    assert.equal(await getFee({ connection, tx }), "0.000505");
  });

  it("keeps ordinary XRP transactions and blobs on the existing path", async () => {
    const tx = { TransactionType: "Payment", Account: account, Destination: account, Amount: "1" };
    const txBlob = encode(tx);
    const { connection, requests } = mockConnection();
    assert.equal(await getFee({ connection, tx }), "0.000014");
    assert.equal(await getFee({ connection, tx: txBlob }), "0.000014");
    assert.deepEqual(requests, [{ command: "fee", tx_blob: txBlob }, { command: "fee", tx_blob: txBlob }]);
  });

  it("delegates XAH Batch objects and blobs to the node without local fee calculation", async () => {
    Client.setup([], { nativeCurrency: "XAH" });
    const tx = batch(1);
    const txBlob = encode(tx);
    const { connection, requests } = mockConnection();
    assert.equal(await getFee({ connection, tx }), "0.000014");
    assert.equal(await getFee({ connection, tx: txBlob }), "0.000014");
    assert.deepEqual(requests, [{ command: "fee", tx_blob: txBlob }, { command: "fee", tx_blob: txBlob }]);
  });

  it("rejects invalid counts, malformed entries and nested batches before RPC", async () => {
    const invalidTransactions = [
      {}, [], [{}], [null, {}],
      ...[0, 1, 9].map((count) => batch(count).RawTransactions),
      [{ RawTransaction: { TransactionType: "Batch" } }, { RawTransaction: { TransactionType: "Payment" } }],
    ];
    const { connection, requests } = mockConnection();
    for (const RawTransactions of invalidTransactions) {
      await assert.rejects(getFee({ connection, tx: { ...batch(), RawTransactions } }), /between 2 and 8 non-Batch transactions/);
    }
    assert.equal(requests.length, 0);
  });

  it("preserves structured node errors and getFee's null result", async () => {
    const error = { status: "error", error: "tooBusy", error_code: 9, error_message: "Busy" };
    const { connection } = mockConnection(error);
    assert.deepEqual(await getFeeData({ connection, tx: batch() }), error);
    assert.equal(await getFee({ connection, tx: batch() }), null);
  });

  it("lets the node report malformed or unsupported XRP blobs", async () => {
    const error = { status: "error", error: "invalidTransaction" };
    const { connection, requests } = mockConnection(error);
    assert.deepEqual(await getFeeData({ connection, tx: "BAD" }), error);
    assert.deepEqual(requests, [{ command: "fee", tx_blob: "BAD" }]);
  });

  it("does not fall back to a cheap fee when the quote is missing or invalid", async () => {
    for (const response of [undefined, { result: { drops: {} } }]) {
      const { connection } = mockConnection(response === undefined ? null : response);
      assert.equal(await getFee({ connection, tx: batch() }), null);
    }
    const { connection } = mockConnection({ result: { drops: { open_ledger_fee: "0" } } });
    await assert.rejects(getFee({ connection, tx: batch() }), /Unable to get fee from network/);
  });

  it("rejects unavailable or invalid owner reserve", async () => {
    const tx = batch();
    tx.RawTransactions[0].RawTransaction.TransactionType = "AMMCreate";
    for (const increment of [undefined, null, false, {}, 0, -1, NaN, Infinity]) {
      const serverInfo = { validated_ledger: { reserve_inc_xrp: increment } };
      const { connection, requests } = mockConnection(feeResponse, serverInfo);
      await assert.rejects(getFee({ connection, tx }), /Unable to get owner reserve from connection/);
      assert.deepEqual(requests.map(({ command }) => command), ["fee"]);
    }
    for (const serverInfo of [null, {}, { validated_ledger: null }]) {
      const { connection, requests } = mockConnection(feeResponse, serverInfo);
      assert.equal(connection.getIncrementFee(), undefined);
      await assert.rejects(getFee({ connection, tx }), /Unable to get owner reserve from connection/);
      assert.deepEqual(requests.map(({ command }) => command), ["fee"]);
    }
  });

  it("rejects malformed EscrowFinish fulfillment", async () => {
    const tx = batch();
    const { connection } = mockConnection();
    for (const Fulfillment of ["A", "GG", 123]) {
      tx.RawTransactions[0].RawTransaction = { TransactionType: "EscrowFinish", Fulfillment };
      await assert.rejects(getFee({ connection, tx }), /Invalid EscrowFinish fulfillment/);
    }
  });
});
