import { expect } from "chai";
import { Models } from "../../src/index";

describe("Models", () => {
  describe("parseOfferFlags", () => {
    it("parses flags for not burnable", function () {
      const result: any = Models.parseOfferFlags(0);
      expect(result).to.eql({
        passive: false,
        sell: false,
      });
    });

    it("parses flags for burnable", function () {
      const result: any = Models.parseOfferFlags(3276800);
      expect(result).to.eql({
        passive: false,
        sell: true,
      });
    });
  });
});
