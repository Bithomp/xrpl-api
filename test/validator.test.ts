import { expect } from "chai";
import { Validator } from "../src/index";

describe("Wallet", () => {
  describe("isValidClassicAddress", () => {
    it("works for valid", async function () {
      const pk = "nHBtDzdRDykxiuv7uSMPTcGexNm879RUUz5GW4h1qgjbtyvWZ1LE";
      const address = "rHiJahydBswnAUMZk5yhTjTvcjBE1fXAGh";

      expect(Validator.classicAddressFromValidatorPK(pk)).to.eql(address);
    });
  });
});
