import nconf from "nconf";
import { expect } from "chai";
import { Client, Wallet } from "../../src/index";

describe("Client", () => {
  describe("getFee", () => {
    describe("testnet", () => {
      before(async function () {
        this.timeout(15000);
        Client.setup(nconf.get("xrpl:connections:testnet"), { nativeCurrency: "XRP" });
        await Client.connect();
      });

      it("returns fee", async function () {
        expect(await Client.getFee()).to.eql("0.000013");
      });
    });

    describe("xahau", () => {
      before(async function () {
        this.timeout(15000);
        Client.setup(nconf.get("xrpl:connections:xahau"), { nativeCurrency: "XAH" });
        await Client.connect();
      });

      it("returns null for Remit tx without Destination", async function () {
        expect(
          await Client.getFee({
            tx: {
              Account: "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
              Sequence: 0,
              Fee: "0",
              SigningPubKey: "",
              TransactionType: "Remit",
            },
            definitions: Wallet.getXahauDefinitions(),
          })
        ).to.be.null;
      });

      it("returns error for Remit tx without Destination", async function () {
        expect(
          await Client.getFeeData({
            tx: {
              Account: "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
              Sequence: 0,
              Fee: "0",
              SigningPubKey: "",
              TransactionType: "Remit",
            },
            definitions: Wallet.getXahauDefinitions(),
          })
        ).to.eql({
          error: "invalidTransaction",
          error_exception: "Field 'Destination' is required but missing.",
          status: "error",
        });
      });

      it("returns fee for tx", async function () {
        const response: any = await Client.getFeeData({
          tx: {
            Account: "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
            Destination: "rPT1Sjq2YGrBMTttX4GZHjKu9dyfzbpAYe",
            Sequence: 0,
            Fee: "0",
            SigningPubKey: "",
            TransactionType: "Payment",
            Amount: "0",
          },
          definitions: Wallet.getXahauDefinitions(),
        });

        expect(parseFloat(response.fee)).to.gte(0.000013);
      });
    });
  });
});
