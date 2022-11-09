import { expect } from "chai";
import { parseMarker } from "../../src/common/utils";

describe("Common", () => {
  describe("Utils", () => {
    describe.only("#parseMarker", () => {
      it("returns undefined if marker is undefined", async function () {
        const result: any = parseMarker(undefined);
        expect(result).to.eq({
          hash: undefined,
          marker: undefined,
        });
      });

      it("returns undefined if marker is empty string", async function () {
        const result: any = parseMarker("");
        expect(result).to.eq({
          hash: undefined,
          marker: undefined,
        });
      });

      it("returns marker if marker a string", async function () {
        const result: any = parseMarker("marker");
        expect(result).to.eq({
          hash: undefined,
          marker: "marker",
        });
      });

      it("returns marker if marker a string with separator", async function () {
        const result: any = parseMarker("marker1,marker2,marker3");
        expect(result).to.eq({
          hash: "marker1",
          marker: "marker2,marker3",
        });
      });

      it("returns marker if marker an object", async function () {
        const result: any = parseMarker({ marker: "marker" });
        expect(result).to.eq({
          hash: undefined,
          marker: {
            marker: "marker",
          },
        });
      });
    });
  });
});
