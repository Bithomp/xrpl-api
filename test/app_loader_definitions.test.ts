import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { decode, encode, XrplDefinitions } from "ripple-binary-codec";
import enums from "../config/xahau_definitions.json";
import published from "./fixtures/app_loader.json";

const definitions = new XrplDefinitions(enums);
const account = "rWinEUKtN3BmYdDoGU6HZ7tTG54BeCAiz";
const html = "<!doctype html><html><body>App ✓</body></html>";
const document = Buffer.from(html).toString("hex").toUpperCase();

describe("Xahau AppLoader definitions", () => {
  it("serializes AccountSet publication and explicit removal without dropping the document", () => {
    for (const AppLoader of [document, ""]) {
      const tx = {
        TransactionType: "AccountSet",
        Account: account,
        NetworkID: 21337,
        Sequence: 0,
        Fee: "0",
        SigningPubKey: "",
        AppLoader,
      };
      assert.deepEqual(decode(encode(tx, definitions), definitions), tx);
    }
  });

  it("decodes a real validated publication and preserves its signed bytes and hash", () => {
    // Published by the example account; no test transaction is submitted.
    const tx = decode(published.blob, definitions);
    assert.equal(tx.TransactionType, "AccountSet");
    assert.equal(tx.Account, account);
    assert.equal(typeof tx.AppLoader, "string");
    assert.equal(Buffer.from(tx.AppLoader as string, "hex").length, 4095);
    assert.equal(encode(tx, definitions), published.blob);
    const hash = createHash("sha512")
      .update(Buffer.from(`54584E00${published.blob}`, "hex"))
      .digest("hex")
      .slice(0, 64)
      .toUpperCase();
    assert.equal(hash, published.hash);
  });

  it("serializes AppLoader ledger objects and their revision sequence", () => {
    const object = {
      LedgerEntryType: "AppLoader",
      Owner: account,
      Flags: 0,
      AppLoader: document,
      AppLoaderSequence: 1,
    };
    const blob = encode(object, definitions);
    assert.ok(blob.startsWith("11004C"));
    assert.deepEqual(decode(blob, definitions), object);
  });

  it("keeps ordinary AccountSet serialization unchanged", () => {
    const original = {
      ...enums,
      FIELDS: enums.FIELDS.filter(([name]) => name !== "AppLoader" && name !== "AppLoaderSequence"),
    };
    const previous = new XrplDefinitions(original);
    const tx = {
      TransactionType: "AccountSet",
      Account: account,
      Domain: Buffer.from("example.com").toString("hex").toUpperCase(),
      NetworkID: 21337,
      Sequence: 1,
      Fee: "10",
      SigningPubKey: "",
    };
    assert.equal(encode(tx, definitions), encode(tx, previous));
    assert.throws(() => encode({ ...tx, AppLoader: document }, previous), /AppLoader.*not defined/);
  });
});
