import nconf from "nconf";
import { expect } from "chai";
import { Client } from "../../src/index";

describe("Client", () => {
  describe("mainnet", () => {
    before(async function () {
      this.timeout(15000);
      Client.setup(nconf.get("xrpl:connections:mainnet"), { loadBalancing: true, nativeCurrency: "XRP" });
      await Client.connect();
    });

    it("getServerDefinitions", async function () {
      const result: any = await Client.getServerDefinitions();

      if (result.error) {
        expect(result).to.eql({
          error: "unknownCmd",
          error_code: 32,
          error_message: "Unknown method.",
          status: "error",
          validated: undefined,
        });
      } else {
        // for version 2.0.0 and above
        // if present, native_currency_code will be "XRP"
        if (result.native_currency_code) {
          expect(result.native_currency_code).to.eql("XRP");
        }

        delete result.native_currency_code; // can be omitted from some servers
        delete result.TRANSACTION_FLAGS; // can be omitted from some servers
        delete result.TRANSACTION_FLAGS_INDICES; // can be omitted from some servers
        expect(Object.keys(result).sort()).to.eql([
          "FIELDS",
          "LEDGER_ENTRY_TYPES",
          // "TRANSACTION_FLAGS",
          // "TRANSACTION_FLAGS_INDICES",
          "TRANSACTION_RESULTS",
          "TRANSACTION_TYPES",
          "TYPES",
          "hash",
          // "native_currency_code"
        ]);
      }
    });
  });

  describe("xahau-test", () => {
    before(async function () {
      this.timeout(15000);
      Client.setup(nconf.get("xrpl:connections:beta"), { nativeCurrency: "XAH" });
      await Client.connect();
    });

    it("getServerDefinitions", async function () {
      const result: any = await Client.getServerDefinitions();
      delete result.TRANSACTION_FLAGS; // can be omitted from some servers
      delete result.TRANSACTION_FLAGS_INDICES; // can be omitted from some servers
      expect(Object.keys(result).sort()).to.eql([
        "FIELDS",
        "LEDGER_ENTRY_TYPES",
        // "TRANSACTION_FLAGS",
        // "TRANSACTION_FLAGS_INDICES",
        "TRANSACTION_RESULTS",
        "TRANSACTION_TYPES",
        "TYPES",
        "features",
        "hash",
        "native_currency_code",
      ]);

      expect(result.native_currency_code).to.eql("XAH");
    });
  });
});
