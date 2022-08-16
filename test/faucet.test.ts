import { expect } from "chai";
import { Faucet } from "../src/index";

describe("Faucet", () => {
  describe("xrplLabsToXrplResponse", () => {
    it("works with new address", function () {
      const data = {
        address: "rh19DztENXTjC2xPpjFXULmDzWdkS479Zx",
        secret: "s____________________________",
        xrp: 10000,
        hash: "74BCB80645EA4F194EB2AF0CB97671B9E85F6A03CA037EB37A16D467D45DF0D2",
        code: "tesSUCCESS",
      };

      expect(Faucet.xrplLabsToXrplResponse(data)).to.eql({
        account: {
          xAddress: "T7bCcMZiKHsCxCiadSDXJzjUyPYReudkFwJ6BftG4uEXPhj",
          secret: "s____________________________",
          classicAddress: "rh19DztENXTjC2xPpjFXULmDzWdkS479Zx",
          address: "rh19DztENXTjC2xPpjFXULmDzWdkS479Zx",
        },
        amount: 10000,
        balance: 10000,
      });
    });

    it("works with existing address", function () {
      const data = {
        address: "rh19DztENXTjC2xPpjFXULmDzWdkS479Zx",
        secret: "",
        xrp: 10000,
        hash: "74BCB80645EA4F194EB2AF0CB97671B9E85F6A03CA037EB37A16D467D45DF0D2",
        code: "tesSUCCESS",
      };

      expect(Faucet.xrplLabsToXrplResponse(data)).to.eql({
        account: {
          xAddress: "T7bCcMZiKHsCxCiadSDXJzjUyPYReudkFwJ6BftG4uEXPhj",
          classicAddress: "rh19DztENXTjC2xPpjFXULmDzWdkS479Zx",
          address: "rh19DztENXTjC2xPpjFXULmDzWdkS479Zx",
        },
        amount: 10000,
      });
    });
  });

  describe.skip("foundWallet", () => {
    it("works with new address on test xrpl network", async function () {
      const res = await Faucet.foundWallet("test");

      expect(res).to.eql({
        account: {
          xAddress: "TVaRHtuHAZAPhfy7gBqnP1uEWvgqnrae4h7MZzpuxs9mapV",
          secret: "s____________________________",
          classicAddress: "rDgvtnmeAY3o1pjcBwN2RZhqwLg6tV7r4w",
          address: "rDgvtnmeAY3o1pjcBwN2RZhqwLg6tV7r4w",
        },
        amount: 1000,
        balance: 1000,
      });
    });

    it("works with existing address on test xrpl network", async function () {
      const res = await Faucet.foundWallet("test", "rh19DztENXTjC2xPpjFXULmDzWdkS479Zx");

      expect(res).to.eql({
        account: {
          xAddress: "T7bCcMZiKHsCxCiadSDXJzjUyPYReudkFwJ6BftG4uEXPhj",
          classicAddress: "rh19DztENXTjC2xPpjFXULmDzWdkS479Zx",
          address: "rh19DztENXTjC2xPpjFXULmDzWdkS479Zx",
        },
        amount: 1000,
      });
    });

    it("works with new address on test beta network", async function () {
      const res = await Faucet.foundWallet("beta");

      expect(res).to.eql({
        account: {
          xAddress: "TVaRHtuHAZAPhfy7gBqnP1uEWvgqnrae4h7MZzpuxs9mapV",
          secret: "s____________________________",
          classicAddress: "rDgvtnmeAY3o1pjcBwN2RZhqwLg6tV7r4w",
          address: "rDgvtnmeAY3o1pjcBwN2RZhqwLg6tV7r4w",
        },
        amount: 10000,
        balance: 10000,
      });
    });

    it("works with existing address on test beta network", async function () {
      const res = await Faucet.foundWallet("beta", "rDgvtnmeAY3o1pjcBwN2RZhqwLg6tV7r4w");

      expect(res).to.eql({
        account: {
          xAddress: "TVaRHtuHAZAPhfy7gBqnP1uEWvgqnrae4h7MZzpuxs9mapV",
          classicAddress: "rDgvtnmeAY3o1pjcBwN2RZhqwLg6tV7r4w",
          address: "rDgvtnmeAY3o1pjcBwN2RZhqwLg6tV7r4w",
        },
        amount: 10000,
      });
    });
  });
});
