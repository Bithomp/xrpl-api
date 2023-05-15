import { expect } from "chai";
import { Common } from "../../src/index";

describe("Common", () => {
  describe("Utils", () => {
    describe("#dropsToXrp", () => {
      it("returns XRP Value from number", async function () {
        const result: any = Common.dropsToXrp(10000000);
        expect(result).to.eq("10");
      });

      it("returns XRP Value from string", async function () {
        const result: any = Common.dropsToXrp("10000000");
        expect(result).to.eq("10");
      });
    });

    describe("#xrpToDrops", () => {
      it("returns drops Value from number", async function () {
        const result: any = Common.xrpToDrops(10);
        expect(result).to.eq("10000000");
      });

      it("returns drops Value from string", async function () {
        const result: any = Common.xrpToDrops("10");
        expect(result).to.eq("10000000");
      });
    });
  });
});
