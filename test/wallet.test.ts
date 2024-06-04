import { expect } from "chai";
import { Wallet } from "../src/index";

describe("Wallet", () => {
  describe("isValidClassicAddress", () => {
    it("works for valid", async function () {
      expect(Wallet.isValidClassicAddress("rHSeZUD5XGjRWq5f1p3DCC3oAP9sg2pgg8")).to.eql(true);
    });

    it("does not work for invalid", async function () {
      expect(Wallet.isValidClassicAddress("qwert")).to.eql(false);
    });
  });
});
