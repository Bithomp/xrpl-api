import { expect } from "chai";
import { Models } from "../../src/index";

describe("Models", () => {
  describe("accountObjectsToAccountLines", () => {
    it("returns account lines", function () {
      const objects = require("../examples/responses/objects/rLRUyXNh6QNmkdR1xJrnJBGURQeNp9Ltyf.json");
      const result: any = Models.accountObjectsToAccountLines("rLRUyXNh6QNmkdR1xJrnJBGURQeNp9Ltyf", objects);
      expect(result).to.eql([
        {
          account: "rNTvdxPWujQn2sUXYBGxmWrGe4ethkLyhb",
          balance: "123.45",
          currency: "FOO",
          limit: "1000000000",
          limit_peer: "0",
          no_ripple: false,
          no_ripple_peer: false,
        },
      ]);
    });

    it("returns account lines with balances", function () {
      const objects = require("../examples/responses/objects/rhuCDThQpvQ6inFv1KguGymhXBK7K2So9m.json");
      const result: any = Models.accountObjectsToAccountLines("rhuCDThQpvQ6inFv1KguGymhXBK7K2So9m", objects);
      expect(result).to.eql([
        {
          account: "rctArjqVvTHihekzDeecKo6mkTYTUSBNc",
          balance: "0.000049",
          currency: "SGB",
          limit: "1000000000",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
        },
        {
          account: "rcoreNywaoz2ZCQ8Lg2EbSLnGuRBmun6D",
          balance: "0.1575582",
          currency: "434F524500000000000000000000000000000000",
          limit: "500000000",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
        },
        {
          account: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          balance: "0",
          currency: "USD",
          limit: "1000000000",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
        },
        {
          account: "rsoLo2S1kiGeCcn6hCUXVrCpGMWLrRrLZz",
          balance: "0",
          currency: "534F4C4F00000000000000000000000000000000",
          limit: "399979674.2684503",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
        },
        {
          account: "rHXuEaRYnnJHbDeuBH5w8yPh5uwNVh5zAg",
          balance: "5643.84047",
          currency: "ELS",
          limit: "1000000000",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
        },
        {
          account: "rcvxE9PS9YBwxtGg1qNeewV6ZB3wGubZq",
          balance: "0",
          currency: "5553445400000000000000000000000000000000",
          limit: "1000000000",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
        },
        {
          account: "rcxJwVnftZzXqyH9YheB8TgeiZUhNo1Eu",
          balance: "0",
          currency: "FLR",
          limit: "1000000000",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
        },
        {
          account: "rcEGREd8NmkKRE8GE424sksyt1tJVFZwu",
          balance: "0",
          currency: "5553444300000000000000000000000000000000",
          limit: "1000000000",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
        },
        {
          account: "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
          balance: "0",
          currency: "USD",
          limit: "1000000000",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
        },
      ]);
    });

    it("returns all account lines", function () {
      const objects = require("../examples/responses/objects/rQHqfA5bbxgPbBQajcRBBJSfuKLMDW17nr.json");
      const result: any = Models.accountObjectsToAccountLines("rQHqfA5bbxgPbBQajcRBBJSfuKLMDW17nr", objects);
      expect(result.length).to.eq(13);
      expect(result).to.eql([
        {
          account: "rEFMsxytphWCgfTdAXBBYvwhnB5GWjBrY5",
          balance: "8136181634625030e1",
          currency: "01434E5900000000C180694BFF0A625D00000000",
          limit: "8136124662444204e2",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
        },
        {
          account: "rEFMsxytphWCgfTdAXBBYvwhnB5GWjBrY5",
          balance: "0",
          currency: "015841550000000041F76FF6ECB0BAC600000000",
          limit: "928316338.5518048",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
        },
        {
          account: "rGiWhwhtGNdu4Df4ZB68HzQNuxTTy28B5V",
          balance: "0",
          currency: "015553440000000041B096111BF28F7D00000000",
          limit: "18255754842.13878",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: true,
        },
        {
          account: "rEFMsxytphWCgfTdAXBBYvwhnB5GWjBrY5",
          balance: "0",
          currency: "0158415500000000C1F76FF6ECB0BAC600000000",
          limit: "1077237752426209e7",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
        },
        {
          account: "rEFMsxytphWCgfTdAXBBYvwhnB5GWjBrY5",
          balance: "0",
          currency: "01434E590000000041576FF6ECB0BAC500000000",
          limit: "0",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: true,
        },
        {
          account: "rEFMsxytphWCgfTdAXBBYvwhnB5GWjBrY5",
          balance: "0",
          currency: "01434E5900000000C1E76FF6ECB0BAC600000000",
          limit: "1160422227.776528",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
        },
        {
          account: "rEFMsxytphWCgfTdAXBBYvwhnB5GWjBrY5",
          balance: "0",
          currency: "01434E5900000000C1F26FF6ECB0BAC600000000",
          limit: "1099185549769381e-2",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
        },
        {
          account: "rEFMsxytphWCgfTdAXBBYvwhnB5GWjBrY5",
          balance: "0",
          currency: "01434E590000000041F76FF6ECB0BAC600000000",
          limit: "928316432.8380369",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: true,
        },
        {
          account: "rEFMsxytphWCgfTdAXBBYvwhnB5GWjBrY5",
          balance: "1077246080380300e-1",
          currency: "0158525000000000C1F76FF6ECB0BAC600000000",
          limit: "1077257977517231e3",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
        },
        {
          account: "rEFMsxytphWCgfTdAXBBYvwhnB5GWjBrY5",
          balance: "0",
          currency: "01434E5900000000C1B08FF6ECB0BAC500000000",
          limit: "538782896.8579473",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
        },
        {
          account: "rEFMsxytphWCgfTdAXBBYvwhnB5GWjBrY5",
          balance: "0",
          currency: "01434E5900000000C1B05FF6ECB0BAC500000000",
          limit: "0",
          limit_peer: "301669700.0912015",
          no_ripple: true,
          no_ripple_peer: true,
        },
        {
          account: "rEFMsxytphWCgfTdAXBBYvwhnB5GWjBrY5",
          balance: "0",
          currency: "01434E590000000041B08FF6ECB0BAC500000000",
          limit: "18561.33771773405",
          limit_peer: "3445.229131879006",
          no_ripple: true,
          no_ripple_peer: true,
        },
        {
          account: "rEFMsxytphWCgfTdAXBBYvwhnB5GWjBrY5",
          balance: "0",
          currency: "01434E5900000000C1F66FF6ECB0BAC600000000",
          limit: "1080809366.120872",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
        },
      ]);
    });
  });
});
