import { expect } from "chai";
import { Models } from "../../src/index";

describe("Models", () => {
  describe("MPToken", () => {
    describe("buildMPTokenIssuanceID", () => {
      it("returns MPTokenIssuanceID", function () {
        const result: string = Models.buildMPTokenIssuanceID(6560006, "raZ3wTTKiMHn3BiStvz4ET9rbCHfU1DMak");
        expect(result).to.eql("006419063CEBEB49FC20032206CE0F203138BFC59F1AC578");
      });
    });

    describe("parseMPTokenIssuanceID", () => {
      it("returns MPTokenInterface", function () {
        const result: any = Models.parseMPTokenIssuanceID("006419063CEBEB49FC20032206CE0F203138BFC59F1AC578");
        expect(result).to.eql({
          MPTokenIssuanceID: "006419063CEBEB49FC20032206CE0F203138BFC59F1AC578",
          Sequence: 6560006,
          Issuer: "raZ3wTTKiMHn3BiStvz4ET9rbCHfU1DMak",
        });
      });
    });
  });
});
