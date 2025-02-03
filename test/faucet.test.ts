import { expect } from "chai";
import { Faucet } from "../src/index";

describe("Faucet", () => {
  describe("getFaucetNetwork", () => {
    it("returns undefined for invalid network", () => {
      expect(Faucet.getFaucetNetwork("invalid")).to.be.undefined;
    });

    it("returns data for test", () => {
      expect(Faucet.getFaucetNetwork("test")).to.eql({
        url: "https://faucet.altnet.rippletest.net/accounts",
        format: "xrpl",
      });
    });

    it("returns data for xahau-test", () => {
      expect(Faucet.getFaucetNetwork("xahau-test")).to.eql({
        url: "https://xahau-test.net/newcreds",
        format: "xrpl-labs",
      });
    });
  });

  describe("getAxiosFaucetOptions", () => {
    it("returns options for xrpl new account", () => {
      expect(Faucet.getAxiosFaucetOptions({ url: "https://test", format: "xrpl" })).to.eql({
        method: "post",
        url: "https://test",
      });
    });

    it("returns options for xrpl", () => {
      expect(Faucet.getAxiosFaucetOptions({ url: "https://test", format: "xrpl" }, "tTest")).to.eql({
        method: "post",
        url: "https://test",
        data: {
          destination: "tTest",
        },
      });
    });

    it("returns options for xrpl-lab new account", () => {
      expect(Faucet.getAxiosFaucetOptions({ url: "https://test", format: "xrpl-labs" })).to.eql({
        method: "post",
        url: "https://test",
      });
    });

    it("returns options for xrpl-lab", () => {
      expect(Faucet.getAxiosFaucetOptions({ url: "https://test", format: "xrpl-labs" }, "tTest")).to.eql({
        method: "post",
        url: "https://test?account=tTest",
      });
    });
  });

  describe("xrplLabsToXrplResponse", () => {
    it("works with new address", function () {
      const data = {
        address: "rh19DztENXTjC2xPpjFXULmDzWdkS479Zx",
        secret: "s____________________________",
        xrp: 10000,
        hash: "74BCB80645EA4F194EB2AF0CB97671B9E85F6A03CA037EB37A16D467D45DF0D2",
        code: "tesSUCCESS",
      };

      const res = Faucet.xrplLabsToXrplResponse(data);
      expect(res.hash).to.be.a("string");
      delete res.hash;
      expect(res).to.eql({
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

      const res = Faucet.xrplLabsToXrplResponse(data);
      expect(res.hash).to.be.a("string");
      delete res.hash;
      expect(res).to.eql({
        account: {
          xAddress: "T7bCcMZiKHsCxCiadSDXJzjUyPYReudkFwJ6BftG4uEXPhj",
          classicAddress: "rh19DztENXTjC2xPpjFXULmDzWdkS479Zx",
          address: "rh19DztENXTjC2xPpjFXULmDzWdkS479Zx",
        },
        amount: 10000,
      });
    });
  });

  describe("foundWallet", () => {
    // skip to not generate new accounts every time
    it.skip("works with new address on test xrpl network", async function () {
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
      this.timeout(10000);
      const res = await Faucet.foundWallet("test", "rJ13fFbRaYvuY5Xbd1QE4HCrV1mKdFaLaj");

      delete res.transactionHash; // can be missing
      expect(res).to.eql({
        account: {
          xAddress: "TVPHVUZfDDJo631W4CZg5oa8fNwwGhn4j9CMTkc35mXminK",
          classicAddress: "rJ13fFbRaYvuY5Xbd1QE4HCrV1mKdFaLaj",
          address: "rJ13fFbRaYvuY5Xbd1QE4HCrV1mKdFaLaj",
        },
        amount: 100,
      });
    });

    // skip to not generate new accounts every time
    it.skip("works with new address on xahau-test network", async function () {
      const res = await Faucet.foundWallet("xahau-test");

      expect(res.hash).to.be.a("string");
      delete res.hash;
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

    it("works with existing address on xahau-test xrpl network", async function () {
      const res = await Faucet.foundWallet("xahau-test", "rJ13fFbRaYvuY5Xbd1QE4HCrV1mKdFaLaj");

      expect(res.hash).to.be.a("string");
      delete res.hash;
      expect(res).to.eql({
        account: {
          xAddress: "TVPHVUZfDDJo631W4CZg5oa8fNwwGhn4j9CMTkc35mXminK",
          classicAddress: "rJ13fFbRaYvuY5Xbd1QE4HCrV1mKdFaLaj",
          address: "rJ13fFbRaYvuY5Xbd1QE4HCrV1mKdFaLaj",
        },
        amount: 1000,
      });
    });

    it("works with existing address on xahau-jshooks xrpl network", async function () {
      const res = await Faucet.foundWallet("xahau-jshooks", "rJ13fFbRaYvuY5Xbd1QE4HCrV1mKdFaLaj");

      expect(res.hash).to.be.a("string");
      delete res.hash;
      expect(res).to.eql({
        account: {
          xAddress: "TVPHVUZfDDJo631W4CZg5oa8fNwwGhn4j9CMTkc35mXminK",
          classicAddress: "rJ13fFbRaYvuY5Xbd1QE4HCrV1mKdFaLaj",
          address: "rJ13fFbRaYvuY5Xbd1QE4HCrV1mKdFaLaj",
        },
        amount: 50,
      });
    });
  });
});
