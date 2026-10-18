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

    describe("#createMarker and #parseMarker", () => {
      it("does not mutate the original marker object", () => {
        const original = { ledger: 16658790, seq: 1 };
        const result = Common.createMarker("hash", original);

        expect(result).to.not.equal(original);
        expect(result).to.eql({ ledger: 16658790, seq: 1, bithompHash: "hash" });
        expect(original).to.eql({ ledger: 16658790, seq: 1 });
      });

      it("does not delete the custom hash field from the original marker object", () => {
        const original = { ledger: 16658790, seq: 1, bithompHash: "hash" };
        const result = Common.parseMarker(original);

        expect(result).to.eql({ hash: "hash", marker: { ledger: 16658790, seq: 1 } });
        expect(original).to.eql({ ledger: 16658790, seq: 1, bithompHash: "hash" });
      });
    });

    describe("#removeUndefined", () => {
      it("removes null and undefined values without mutating the original object", () => {
        const original = { keep: "yes", dropNull: null, dropUndefined: undefined, nested: { a: 1, b: undefined } };
        const result = Common.removeUndefined(original);

        expect(result).to.eql({ keep: "yes", nested: { a: 1, b: undefined } });
        expect(original).to.eql({ keep: "yes", dropNull: null, dropUndefined: undefined, nested: { a: 1, b: undefined } });
      });
    });
  });
});
