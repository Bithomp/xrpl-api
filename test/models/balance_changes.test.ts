import { expect } from "chai";
import { Models } from "../../src/index";

describe("Models", () => {
  describe("parseFinalBalances", () => {
    it("parses for NFTokenAcceptOfferSell", function () {
      const tx = require("../examples/responses/NFTokenAcceptOfferSell.json");
      const result: any = Models.parseFinalBalances(tx.meta);

      expect(result).to.eql({
        rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw: [{ currency: "XRP", value: "999.999904" }],
        r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3: [{ currency: "XRP", value: "999.999832" }],
      });
    });

    it("parses for Escrow IOU", function () {
      const tx = require("../examples/responses/transaction/CB192FC862D00F6A49E819EF99053BE534A6EC703418306E415C6230F5786FDB.json");
      const result: any = Models.parseFinalBalances(tx.meta);

      expect(result).to.eql({
        r9N4v3cWxfh4x6yUNjxNy3DbWUgbzMBLdk: [
          {
            issuer: "rM3YFJAHYBufChMHsBLZzwzg7a2oBCP7vV",
            currency: "546F6B656E466F72457363726F77000000000000",
            value: "100",
            counterparty: "rM3YFJAHYBufChMHsBLZzwzg7a2oBCP7vV",
          },
          { currency: "XRP", value: "4736.99982" },
        ],
        rM3YFJAHYBufChMHsBLZzwzg7a2oBCP7vV: [
          {
            issuer: "rM3YFJAHYBufChMHsBLZzwzg7a2oBCP7vV",
            currency: "546F6B656E466F72457363726F77000000000000",
            value: "-100",
            counterparty: "r9N4v3cWxfh4x6yUNjxNy3DbWUgbzMBLdk",
          },
        ],
        rELeasERs3m4inA1UinRLTpXemqyStqzwh: [{ currency: "XRP", value: "49.999976" }],
      });
    });

    it("parses for Clawback", function () {
      const tx = require("../examples/responses/Clawback.json");
      const result: any = Models.parseFinalBalances(tx.meta);

      expect(result).to.eql({
        rYNKrtQaf3vUVWVK5sw9rJdPGDLbxZu89: [
          { currency: "XRP", value: "19.754728" },
          {
            issuer: "rYNKrtQaf3vUVWVK5sw9rJdPGDLbxZu89",
            currency: "594F494E4B000000000000000000000000000000",
            value: "-413.3967",
            counterparty: "rGnBUCwMJSX57QDecdyT5drdG3gvsmVqxD",
          },
        ],
        rGnBUCwMJSX57QDecdyT5drdG3gvsmVqxD: [
          {
            issuer: "rYNKrtQaf3vUVWVK5sw9rJdPGDLbxZu89",
            currency: "594F494E4B000000000000000000000000000000",
            value: "413.3967",
            counterparty: "rYNKrtQaf3vUVWVK5sw9rJdPGDLbxZu89",
          },
        ],
      });
    });

    it("parses for MPToken", function () {
      const tx = require("../examples/responses/Payment_MPToken2.json");
      const result: any = Models.parseFinalBalances(tx.meta);
      expect(result).to.eql({
        rLWSJKbwYSzG32JuGissYd66MFTvfMk4Bt: [
          { currency: "XRP", value: "99.99976" },
          {
            value: "900",
            mpt_issuance_id: "006419063CEBEB49FC20032206CE0F203138BFC59F1AC578",
          },
        ],
        raZ3wTTKiMHn3BiStvz4ET9rbCHfU1DMak: [
          {
            value: "49999100",
            mpt_issuance_id: "006419063CEBEB49FC20032206CE0F203138BFC59F1AC578",
          },
        ],
      });
    });
  });
});
