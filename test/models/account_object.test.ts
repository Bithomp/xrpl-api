import { expect } from "chai";
import { Models } from "../../src/index";

describe("Models", () => {
  describe("accountObjectsToAccountLines", () => {
    it("returns account lines", function () {
      const objects = require("../examples/responses/objects/rHSeZUD5XGjRWq5f1p3DCC3oAP9sg2pgg8.json");
      const result: any = Models.accountObjectsToAccountLines("rHSeZUD5XGjRWq5f1p3DCC3oAP9sg2pgg8", objects);
      expect(result).to.eql([
        {
          account: "rESkTa8rXUGKs1njRrJGYSTwB5R1XYCEAt",
          balance: "123.45",
          currency: "FOO",
          limit: "1000000000",
          limit_peer: "0",
          no_ripple: false,
          no_ripple_peer: false,
          authorized: false,
          peer_authorized: false,
        },
      ]);
    });

    it("returns account lines with locked balance", function () {
      const objects = require("../examples/responses/objects/r9N4v3cWxfh4x6yUNjxNy3DbWUgbzMBLdk.json");
      const result: any = Models.accountObjectsToAccountLines("r9N4v3cWxfh4x6yUNjxNy3DbWUgbzMBLdk", objects);
      expect(result).to.eql([
        {
          account: "rEvernodee8dJLaFsujS6q1EiXvZYmHXr8",
          balance: "400.0000000000309",
          currency: "EVR",
          limit: "10000000",
          limit_peer: "0",
          lock_count: 1,
          locked_balance: "13.37",
          no_ripple: true,
          no_ripple_peer: false,
          authorized: false,
          peer_authorized: false,
        },
      ]);
    });

    it("returns account lines with negative locked balance", function () {
      const objects = require("../examples/responses/objects/rwietsevLFg8XSmG3bEZzFein1g8RBqWDZ.json");
      const result: any = Models.accountObjectsToAccountLines("rwietsevLFg8XSmG3bEZzFein1g8RBqWDZ", objects);
      expect(result).to.eql([
        {
          account: "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
          balance: "45.9031084076433",
          currency: "XRP",
          limit: "1000000000",
          limit_peer: "0",
          lock_count: 1,
          locked_balance: "10",
          no_ripple: true,
          no_ripple_peer: false,
          authorized: false,
          peer_authorized: false,
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
          authorized: false,
          peer_authorized: false,
        },
        {
          account: "rcoreNywaoz2ZCQ8Lg2EbSLnGuRBmun6D",
          balance: "0.1575582",
          currency: "434F524500000000000000000000000000000000",
          limit: "500000000",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
          authorized: false,
          peer_authorized: false,
        },
        {
          account: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          balance: "0",
          currency: "USD",
          limit: "1000000000",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
          authorized: false,
          peer_authorized: false,
        },
        {
          account: "rsoLo2S1kiGeCcn6hCUXVrCpGMWLrRrLZz",
          balance: "0",
          currency: "534F4C4F00000000000000000000000000000000",
          limit: "399979674.2684503",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
          authorized: false,
          peer_authorized: false,
        },
        {
          account: "rHXuEaRYnnJHbDeuBH5w8yPh5uwNVh5zAg",
          balance: "5643.84047",
          currency: "ELS",
          limit: "1000000000",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
          authorized: false,
          peer_authorized: false,
        },
        {
          account: "rcvxE9PS9YBwxtGg1qNeewV6ZB3wGubZq",
          balance: "0",
          currency: "5553445400000000000000000000000000000000",
          limit: "1000000000",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
          authorized: false,
          peer_authorized: false,
        },
        {
          account: "rcxJwVnftZzXqyH9YheB8TgeiZUhNo1Eu",
          balance: "0",
          currency: "FLR",
          limit: "1000000000",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
          authorized: false,
          peer_authorized: false,
        },
        {
          account: "rcEGREd8NmkKRE8GE424sksyt1tJVFZwu",
          balance: "0",
          currency: "5553444300000000000000000000000000000000",
          limit: "1000000000",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
          authorized: false,
          peer_authorized: false,
        },
        {
          account: "rhub8VRN55s94qWKDv6jmDy1pUykJzF3wq",
          balance: "0",
          currency: "USD",
          limit: "1000000000",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
          authorized: false,
          peer_authorized: false,
        },
      ]);
    });

    it("returns account lines with issuer as reserve owner with positive balance", function () {
      const objects = require("../examples/responses/objects/ravc8BJ3j1UPUXTyj2T2yutQSF82ZvJw9E.json");
      const result: any = Models.accountObjectsToAccountLines("ravc8BJ3j1UPUXTyj2T2yutQSF82ZvJw9E", objects);
      expect(result).to.eql([
        {
          account: "rQsYRw8vEPGGphTStYbPuLB71VzhrfQ7zf",
          balance: "100",
          currency: "HSC",
          limit: "0",
          limit_peer: "7777777777770000e-4",
          no_ripple: false,
          no_ripple_peer: false,
          authorized: false,
          peer_authorized: false,
        },
        {
          account: "rQsYRw8vEPGGphTStYbPuLB71VzhrfQ7zf",
          balance: "0",
          currency: "JPY",
          limit: "100000",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
          authorized: false,
          peer_authorized: false,
        },
      ]);
    });

    it("returns account lines with holder as reserve owner with negative balance", function () {
      const objects = require("../examples/responses/objects/rGcQo3R21J8BpextdCS1KNhweUJht6c8Pv.json");
      const result: any = Models.accountObjectsToAccountLines("rGcQo3R21J8BpextdCS1KNhweUJht6c8Pv", objects);
      expect(result).to.eql([
        {
          account: "rs2vd5QdZg2WmAB8EYd4AKxUxP2BY1zacn",
          balance: "594.373",
          currency: "BTC",
          limit: "0",
          limit_peer: "10000000000",
          no_ripple: true,
          no_ripple_peer: true,
          authorized: false,
          peer_authorized: false,
        },
      ]);
    });

    it("returns account lines with holder as reserve owner with positive balance for issuer", function () {
      const objects = require("../examples/responses/objects/rw4nfCN97BtDxjxDv9dDJV53CtGxB2yoNA.json");
      const result: any = Models.accountObjectsToAccountLines("rw4nfCN97BtDxjxDv9dDJV53CtGxB2yoNA", objects);
      expect(result).to.eql([
        {
          account: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B",
          balance: "0",
          currency: "TCC",
          limit: "50",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
          authorized: false,
          peer_authorized: false,
        },
        {
          account: "rp2PaYDxVwDvaZVLEQv7bHhoFQEyX1mEx7",
          balance: "0.006",
          currency: "USD",
          limit: "10",
          limit_peer: "0",
          no_ripple: false,
          no_ripple_peer: false,
          authorized: false,
          peer_authorized: false,
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
          authorized: false,
          peer_authorized: false,
        },
        {
          account: "rEFMsxytphWCgfTdAXBBYvwhnB5GWjBrY5",
          balance: "0",
          currency: "015841550000000041F76FF6ECB0BAC600000000",
          limit: "928316338.5518048",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
          authorized: false,
          peer_authorized: false,
        },
        {
          account: "rGiWhwhtGNdu4Df4ZB68HzQNuxTTy28B5V",
          balance: "0",
          currency: "015553440000000041B096111BF28F7D00000000",
          limit: "18255754842.13878",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: true,
          authorized: false,
          peer_authorized: false,
        },
        {
          account: "rEFMsxytphWCgfTdAXBBYvwhnB5GWjBrY5",
          balance: "0",
          currency: "0158415500000000C1F76FF6ECB0BAC600000000",
          limit: "1077237752426209e7",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
          authorized: false,
          peer_authorized: false,
        },
        {
          account: "rEFMsxytphWCgfTdAXBBYvwhnB5GWjBrY5",
          balance: "0",
          currency: "01434E590000000041576FF6ECB0BAC500000000",
          limit: "0",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: true,
          authorized: false,
          peer_authorized: false,
        },
        {
          account: "rEFMsxytphWCgfTdAXBBYvwhnB5GWjBrY5",
          balance: "0",
          currency: "01434E5900000000C1E76FF6ECB0BAC600000000",
          limit: "1160422227.776528",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
          authorized: false,
          peer_authorized: false,
        },
        {
          account: "rEFMsxytphWCgfTdAXBBYvwhnB5GWjBrY5",
          balance: "0",
          currency: "01434E5900000000C1F26FF6ECB0BAC600000000",
          limit: "1099185549769381e-2",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
          authorized: false,
          peer_authorized: false,
        },
        {
          account: "rEFMsxytphWCgfTdAXBBYvwhnB5GWjBrY5",
          balance: "0",
          currency: "01434E590000000041F76FF6ECB0BAC600000000",
          limit: "928316432.8380369",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: true,
          authorized: false,
          peer_authorized: false,
        },
        {
          account: "rEFMsxytphWCgfTdAXBBYvwhnB5GWjBrY5",
          balance: "1077246080380300e-1",
          currency: "0158525000000000C1F76FF6ECB0BAC600000000",
          limit: "1077257977517231e3",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
          authorized: false,
          peer_authorized: false,
        },
        {
          account: "rEFMsxytphWCgfTdAXBBYvwhnB5GWjBrY5",
          balance: "0",
          currency: "01434E5900000000C1B08FF6ECB0BAC500000000",
          limit: "538782896.8579473",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
          authorized: false,
          peer_authorized: false,
        },
        {
          account: "rEFMsxytphWCgfTdAXBBYvwhnB5GWjBrY5",
          balance: "0",
          currency: "01434E5900000000C1B05FF6ECB0BAC500000000",
          limit: "0",
          limit_peer: "301669700.0912015",
          no_ripple: true,
          no_ripple_peer: true,
          authorized: false,
          peer_authorized: false,
        },
        {
          account: "rEFMsxytphWCgfTdAXBBYvwhnB5GWjBrY5",
          balance: "0",
          currency: "01434E590000000041B08FF6ECB0BAC500000000",
          limit: "18561.33771773405",
          limit_peer: "3445.229131879006",
          no_ripple: true,
          no_ripple_peer: true,
          authorized: false,
          peer_authorized: false,
        },
        {
          account: "rEFMsxytphWCgfTdAXBBYvwhnB5GWjBrY5",
          balance: "0",
          currency: "01434E5900000000C1F66FF6ECB0BAC600000000",
          limit: "1080809366.120872",
          limit_peer: "0",
          no_ripple: true,
          no_ripple_peer: false,
          authorized: false,
          peer_authorized: false,
        },
      ]);
    });
  });
});
