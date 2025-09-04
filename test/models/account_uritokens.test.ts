import { expect } from "chai";
import { Models } from "../../src/index";

describe("Models", () => {
  describe("parseURITokenFlags", () => {
    it("parses flags for not burnable", function () {
      const result: any = Models.parseURITokenFlags(0);
      expect(result).to.eql({ burnable: false });
    });

    it("parses flags for burnable", function () {
      const result: any = Models.parseURITokenFlags(1);
      expect(result).to.eql({ burnable: true });
    });
  });
});
