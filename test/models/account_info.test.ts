import { expect } from "chai";
import { Models } from "../../src/index";

describe("Models", () => {
  describe("parseSignerListFlags", () => {
    it("returns decoded flags", async function () {
      const result: any = Models.parseSignerListFlags(65536);
      expect(result).to.eql({
        oneOwnerCount: true,
      });
    });

    it("returns decoded flags", async function () {
      const result: any = Models.parseSignerListFlags(0);
      expect(result).to.eql({
        oneOwnerCount: false,
      });
    });
  });
});
