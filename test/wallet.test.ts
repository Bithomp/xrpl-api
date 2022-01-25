import { expect } from "chai";
import { Wallet } from "../src/index";

describe("Wallet", () => {
  describe("isValidClassicAddress", () => {
    it("works for valid", async function () {
      expect(Wallet.isValidClassicAddress("rLRUyXNh6QNmkdR1xJrnJBGURQeNp9Ltyf")).to.eql(true);
    });

    it("doesnt work for invalid", async function () {
      expect(Wallet.isValidClassicAddress("qwert")).to.eql(false);
    });
  });
});
