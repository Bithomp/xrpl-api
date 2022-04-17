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

    it("returns account lines", function () {
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
  });
});
