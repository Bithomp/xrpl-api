import { expect } from "chai";
import { Models } from "../../src/index";

describe("Models", () => {
  describe("parseTrustlineFlags", () => {
    it("parses flags for not burnable", function () {
      const result: any = Models.parseTrustlineFlags(0);
      expect(result).to.eql({
        lowReserve: false,
        highReserve: false,
        lowAuth: false,
        highAuth: false,
        lowNoRipple: false,
        highNoRipple: false,
        lowFreeze: false,
        highFreeze: false,
        ammNode: false,
        lowDeepFreeze: false,
        highDeepFreeze: false,
      });
    });

    it("parses flags for burnable", function () {
      const result: any = Models.parseTrustlineFlags(3276800);
      expect(result).to.eql({
        lowReserve: false,
        highReserve: true,
        lowAuth: false,
        highAuth: false,
        lowNoRipple: true,
        highNoRipple: true,
        lowFreeze: false,
        highFreeze: false,
        ammNode: false,
        lowDeepFreeze: false,
        highDeepFreeze: false,
      });
    });
  });
});
