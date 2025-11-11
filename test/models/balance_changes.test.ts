import { expect } from "chai";
import { Models } from "../../src/index";
import { MAINNET_NATIVE_CURRENCY } from "../../src/common";

describe("Models", () => {
  describe("parseBalanceChanges", () => {
    it("parses for EscrowCreate", function () {
      const tx = require("../examples/responses/transaction/C44F2EB84196B9AD820313DBEBA6316A15C9A2D35787579ED172B87A30131DA7.json");
      const result: any = Models.parseBalanceChanges(tx.meta);

      expect(result).to.eql({ rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn: [{ currency: "XRP", value: "-0.01001" }] });
    });

    it("parses for EscrowCreate with adjustBalancesForNativeEscrow", function () {
      const tx = require("../examples/responses/transaction/C44F2EB84196B9AD820313DBEBA6316A15C9A2D35787579ED172B87A30131DA7.json");
      const result: any = Models.parseBalanceChanges(tx.meta, MAINNET_NATIVE_CURRENCY, tx, {
        adjustBalancesForNativeEscrow: true,
      });

      expect(result).to.eql({ rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn: [{ currency: "XRP", value: "-0.00001" }] });
    });

    it("parses for EscrowFinish IOU unlock", function () {
      const tx = require("../examples/responses/transaction/CB192FC862D00F6A49E819EF99053BE534A6EC703418306E415C6230F5786FDB.json");
      const result: any = Models.parseBalanceChanges(tx.meta);

      expect(result).to.eql({ rELeasERs3m4inA1UinRLTpXemqyStqzwh: [{ currency: "XRP", value: "-0.000012" }] });
    });

    it("parses for EscrowFinish transfer", function () {
      const tx = require("../examples/responses/EscrowFinish2.json");
      const result: any = Models.parseBalanceChanges(tx.meta, MAINNET_NATIVE_CURRENCY, tx, {
        adjustBalancesForNativeEscrow: false,
      });

      expect(result).to.eql({
        rWsWrfgbhim1Quy7JjvoCJBo1QdcJftKF: [{ currency: "XRP", value: "205" }],
        rprvkvUyxkZVtEtqa3gQ7g7qNEfDzD4tB9: [{ currency: "XRP", value: "-0.000012" }],
      });
    });

    it("parses for EscrowFinish transfer with adjustBalancesForNativeEscrow", function () {
      const tx = require("../examples/responses/EscrowFinish2.json");
      const result: any = Models.parseBalanceChanges(tx.meta, MAINNET_NATIVE_CURRENCY, tx, {
        adjustBalancesForNativeEscrow: true,
      });

      expect(result).to.eql({
        rWsWrfgbhim1Quy7JjvoCJBo1QdcJftKF: [{ currency: "XRP", value: "205" }],
        rprvkvUyxkZVtEtqa3gQ7g7qNEfDzD4tB9: [{ currency: "XRP", value: "-205.000012" }],
      });
    });

    it("parses for EscrowFinish unlock", function () {
      const tx = require("../examples/responses/EscrowFinish.json");
      const result: any = Models.parseBalanceChanges(tx.meta, MAINNET_NATIVE_CURRENCY, tx, {
        adjustBalancesForNativeEscrow: false,
      });

      expect(result).to.eql({
        rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn: [{ currency: "XRP", value: "-0.005" }],
        rKDvgGUsNPZxsgmoemfrgXPS2Not4co2op: [{ currency: "XRP", value: "1000000000" }],
      });
    });

    it("parses for EscrowFinish unlock with adjustBalancesForNativeEscrow", function () {
      const tx = require("../examples/responses/EscrowFinish.json");
      const result: any = Models.parseBalanceChanges(tx.meta, MAINNET_NATIVE_CURRENCY, tx, {
        adjustBalancesForNativeEscrow: true,
      });

      expect(result).to.eql({ rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn: [{ currency: "XRP", value: "-0.005" }] });
    });

    it("parses for EscrowCancel unlock", function () {
      const tx = require("../examples/responses/transaction/B24B9D7843F99AED7FB8A3929151D0CCF656459AE40178B77C9D44CED64E839B.json");
      const result: any = Models.parseBalanceChanges(tx.meta, MAINNET_NATIVE_CURRENCY, tx, {
        adjustBalancesForNativeEscrow: false,
      });

      expect(result).to.eql({ rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn: [{ currency: "XRP", value: "0.009988" }] });
    });

    it("parses for EscrowCancel unlock with adjustBalancesForNativeEscrow", function () {
      const tx = require("../examples/responses/transaction/B24B9D7843F99AED7FB8A3929151D0CCF656459AE40178B77C9D44CED64E839B.json");
      const result: any = Models.parseBalanceChanges(tx.meta, MAINNET_NATIVE_CURRENCY, tx, {
        adjustBalancesForNativeEscrow: true,
      });

      expect(result).to.eql({ rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn: [{ currency: "XRP", value: "-0.000012" }] });
    });

    it("parses for EscrowCancel unlock for MPT", function () {
      const tx = require("../examples/responses/EscrowCancelMPT.json");
      const result: any = Models.parseBalanceChanges(tx.meta, MAINNET_NATIVE_CURRENCY, tx, {});

      expect(result).to.eql({
        rsvocQWZ4bnshYrfY3b35E25g1p9rvSpx5: [{ currency: "XRP", value: "-0.0001" }],
      });
    });

    it("parses for PaymentChannelCreate", function () {
      const tx = require("../examples/responses/PaymentChannelCreate.json");
      const result: any = Models.parseBalanceChanges(tx.meta, MAINNET_NATIVE_CURRENCY, tx, {
        adjustBalancesForNativeEscrow: false,
      });

      expect(result).to.eql({ rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn: [{ currency: "XRP", value: "-0.00101" }] });
    });

    it("parses for PaymentChannelCreate with adjustBalancesForPaymentChannel", function () {
      const tx = require("../examples/responses/PaymentChannelCreate.json");
      const result: any = Models.parseBalanceChanges(tx.meta, MAINNET_NATIVE_CURRENCY, tx, {
        adjustBalancesForPaymentChannel: true,
      });

      expect(result).to.eql({ rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn: [{ currency: "XRP", value: "-0.00001" }] });
    });

    it("parses for PaymentChannelFund", function () {
      const tx = require("../examples/responses/PaymentChannelFund.json");
      const result: any = Models.parseBalanceChanges(tx.meta, MAINNET_NATIVE_CURRENCY, tx, {
        adjustBalancesForNativeEscrow: false,
      });

      expect(result).to.eql({ rNixEReo8KruCW6pekB5dJS4JGwoU2WbxJ: [{ currency: "XRP", value: "-10.000012" }] });
    });

    it("parses for PaymentChannelFund with adjustBalancesForPaymentChannel", function () {
      const tx = require("../examples/responses/PaymentChannelFund.json");
      const result: any = Models.parseBalanceChanges(tx.meta, MAINNET_NATIVE_CURRENCY, tx, {
        adjustBalancesForPaymentChannel: true,
      });

      expect(result).to.eql({ rNixEReo8KruCW6pekB5dJS4JGwoU2WbxJ: [{ currency: "XRP", value: "-0.000012" }] });
    });

    it("parses for PaymentChannelClaim", function () {
      const tx = require("../examples/responses/PaymentChannelClaim.json");
      const result: any = Models.parseBalanceChanges(tx.meta, MAINNET_NATIVE_CURRENCY, tx, {
        adjustBalancesForNativeEscrow: false,
      });

      expect(result).to.eql({ rK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN: [{ currency: "XRP", value: "0.009988" }] });
    });

    it("parses for PaymentChannelClaim with adjustBalancesForPaymentChannel", function () {
      const tx = require("../examples/responses/PaymentChannelClaim.json");
      const result: any = Models.parseBalanceChanges(tx.meta, MAINNET_NATIVE_CURRENCY, tx, {
        adjustBalancesForPaymentChannel: true,
      });

      expect(result).to.eql({
        rD1ioePTv7P1jgELM3tDkDU1LJqTEwuwo: [{ currency: "XRP", value: "-0.01" }],
        rK6g2UYc4GpQH8DYdPG7wywyQbxkJpQTTN: [{ currency: "XRP", value: "0.009988" }],
      });
    });

    it("parses for PaymentChannelClaim2", function () {
      const tx = require("../examples/responses/PaymentChannelClaim2.json");
      const result: any = Models.parseBalanceChanges(tx.meta, MAINNET_NATIVE_CURRENCY, tx, {
        adjustBalancesForNativeEscrow: false,
      });

      expect(result).to.eql({ rGuVmkbuFWGwcvCpNhKCzXBP7pwAWjvHZG: [{ currency: "XRP", value: "9.919988" }] });
    });

    it("parses for PaymentChannelClaim2 with adjustBalancesForPaymentChannel", function () {
      const tx = require("../examples/responses/PaymentChannelClaim2.json");
      const result: any = Models.parseBalanceChanges(tx.meta, MAINNET_NATIVE_CURRENCY, tx, {
        adjustBalancesForPaymentChannel: true,
      });

      expect(result).to.eql({ rGuVmkbuFWGwcvCpNhKCzXBP7pwAWjvHZG: [{ currency: "XRP", value: "-0.000012" }] });
    });

    it("parses for PaymentChannelClaim3", function () {
      const tx = require("../examples/responses/PaymentChannelClaim3.json");
      const result: any = Models.parseBalanceChanges(tx.meta, MAINNET_NATIVE_CURRENCY, tx, {
        adjustBalancesForNativeEscrow: false,
      });

      expect(result).to.eql({
        rs9PSG1NebVaqkZicNLAi9bbd1AieYoSJ8: [{ currency: "XRP", value: "-0.0001" }],
        rs6WARimLiHZy8qB8XBD5HANgc9SshFYnK: [{ currency: "XRP", value: "0.01" }],
      });
    });

    it("parses for PaymentChannelClaim3 with adjustBalancesForPaymentChannel", function () {
      const tx = require("../examples/responses/PaymentChannelClaim3.json");
      const result: any = Models.parseBalanceChanges(tx.meta, MAINNET_NATIVE_CURRENCY, tx, {
        adjustBalancesForPaymentChannel: true,
      });

      expect(result).to.eql({
        rs9PSG1NebVaqkZicNLAi9bbd1AieYoSJ8: [{ currency: "XRP", value: "-0.0101" }],
        rs6WARimLiHZy8qB8XBD5HANgc9SshFYnK: [{ currency: "XRP", value: "0.01" }],
      });
    });
  });

  describe("parseFinalBalances", () => {
    it("parses for NFTokenAcceptOfferSell", function () {
      const tx = require("../examples/responses/NFTokenAcceptOfferSell.json");
      const result: any = Models.parseFinalBalances(tx.meta);

      expect(result).to.eql({
        rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw: [{ currency: "XRP", value: "999.999904" }],
        r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3: [{ currency: "XRP", value: "999.999832" }],
      });
    });

    it("parses for Escrow IOU unlock", function () {
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

    it("parses for MPToken transfer", function () {
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

    it("parses for MPToken create", function () {
      const tx = require("../examples/responses/MPTokenIssuanceCreate.json");
      const result: any = Models.parseFinalBalances(tx.meta);
      expect(result).to.eql({
        raZ3wTTKiMHn3BiStvz4ET9rbCHfU1DMak: [
          { currency: "XRP", value: "99.99988" },
          {
            mpt_issuance_id: "006419063CEBEB49FC20032206CE0F203138BFC59F1AC578",
            value: "50000000",
          },
        ],
      });
    });

    it("parses for MPToken destroy", function () {
      const tx = require("../examples/responses/MPTokenIssuanceDestroy.json");
      const result: any = Models.parseFinalBalances(tx.meta);
      expect(result).to.eql({
        raZ3wTTKiMHn3BiStvz4ET9rbCHfU1DMak: [
          { currency: "XRP", value: "99.99928" },
          {
            mpt_issuance_id: "006419063CEBEB49FC20032206CE0F203138BFC59F1AC578",
            value: "0",
          },
        ],
      });
    });

    it("parses for MPTokenAuthorize", function () {
      const tx = require("../examples/responses/MPTokenAuthorize.json");
      const result: any = Models.parseFinalBalances(tx.meta);
      expect(result).to.eql({
        raZ3wTTKiMHn3BiStvz4ET9rbCHfU1DMak: [{ currency: "XRP", value: "99.99976" }],
      });
    });
  });
});
