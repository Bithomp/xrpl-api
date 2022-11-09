import { expect } from "chai";
import { createMarker, parseMarker } from "../../src/common/utils";

describe("Common", () => {
  describe("Utils", () => {
    describe("#createMarker", () => {
      it("returns a marker from undefined", async function () {
        const result = createMarker("hash", undefined);
        expect(result).to.eq(undefined);
      });

      it("returns a marker from string", async function () {
        const result = createMarker("hash", "marker");
        expect(result).to.eq("hash,marker");
      });

      it("returns a marker from object", async function () {
        const result = createMarker("hash", { test: "marker" });
        expect(result).to.eql({
          bithompHash: "hash",
          test: "marker",
        });
      });
    });

    describe("#parseMarker", () => {
      it("returns undefined if marker is undefined", async function () {
        const result: any = parseMarker(undefined);
        expect(result).to.eql({
          hash: undefined,
          marker: undefined,
        });
      });

      it("returns undefined if marker is empty string", async function () {
        const result: any = parseMarker("");
        expect(result).to.eql({
          hash: undefined,
          marker: "",
        });
      });

      it("returns marker if marker a string", async function () {
        const result: any = parseMarker("marker");
        expect(result).to.eql({
          hash: undefined,
          marker: "marker",
        });
      });

      it("returns marker if marker a string with separator", async function () {
        const result: any = parseMarker("marker1,marker2,marker3");
        expect(result).to.eql({
          hash: "marker1",
          marker: "marker2,marker3",
        });
      });

      it("returns marker if marker an object", async function () {
        const result: any = parseMarker({ marker: "marker" });
        expect(result).to.eql({
          hash: undefined,
          marker: {
            marker: "marker",
          },
        });
      });

      it("returns marker if marker an object with bithompHash", async function () {
        const result: any = parseMarker({ marker: "marker", bithompHash: "hash" });
        expect(result).to.eql({
          hash: "hash",
          marker: {
            marker: "marker",
          },
        });
      });
    });
  });
});
