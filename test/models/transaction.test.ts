import { expect } from "chai";
import { Models } from "../../src/index";

describe("Models", () => {
  describe("getTxDetails", () => {
    it("NFTokenMint", function () {
      const tx = require("../examples/responses/NFTokenMint.json");
      const result: any = Models.getTxDetails(tx, false);

      expect(result).to.eql({
        address: "r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3",
        id: "E9AC3902CF5C65EFBE203C7669EF1C4412ECE02AA26BD03F40FF987526079F01",
        outcome: {
          balanceChanges: { r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3: [{ currency: "XRP", value: "-0.000012" }] },
          lockedBalanceChanges: {},
          fee: "0.000012",
          indexInLedger: 0,
          ledgerVersion: 1309371,
          nftokenChanges: {
            r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3: [
              {
                status: "added",
                nftokenID: "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC90000099B00000000",
                uri: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
              },
            ],
          },
          nftokenOfferChanges: {},
          affectedObjects: {
            nftokens: {
              "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC90000099B00000000": {
                flags: {
                  burnable: true,
                  onlyXRP: true,
                  transferable: true,
                  trustLine: false,
                },
                issuer: "r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3",
                nftokenID: "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC90000099B00000000",
                nftokenTaxon: 0,
                sequence: 0,
                transferFee: 0,
              },
            },
          },
          orderbookChanges: {},
          result: "tesSUCCESS",
          timestamp: "2022-03-01T08:54:42.000Z",
        },
        sequence: 1309348,
        specification: {
          flags: {
            burnable: true,
            onlyXRP: true,
            transferable: true,
            trustLine: false,
          },
          nftokenTaxon: 0,
          uri: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
        },
        type: "nftokenMint",
      });
    });

    it("NFTokenAcceptOfferBuy", function () {
      const tx = require("../examples/responses/NFTokenAcceptOfferBuy.json");
      const result: any = Models.getTxDetails(tx, false);

      expect(result).to.eql({
        address: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
        id: "41D2E1E3EE5554ADE84F15FFFA8A6A9E7C9EB0464CAAFA822CFAE1DD895DE724",
        outcome: {
          balanceChanges: {
            rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz: [{ currency: "XRP", value: "-0.000011" }],
            rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw: [{ currency: "XRP", value: "-0.000001" }],
          },
          lockedBalanceChanges: {},
          fee: "0.000012",
          indexInLedger: 0,
          ledgerVersion: 75445,
          nftokenChanges: {
            rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz: [
              {
                status: "removed",
                nftokenID: "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF16E5DA9C00000001",
                uri: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
              },
            ],
            rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw: [
              {
                status: "added",
                nftokenID: "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF16E5DA9C00000001",
                uri: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
              },
            ],
          },
          nftokenOfferChanges: {
            rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw: [
              {
                owner: "rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw",
                amount: "1",
                flags: 0,
                status: "deleted",
                nftokenID: "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF16E5DA9C00000001",
                index: "AA12128D6A55784C059FC9654FCBB8904BFCB54C850B2F94046BD9BA2743A021",
              },
            ],
          },
          affectedObjects: {
            nftokenOffers: {
              AA12128D6A55784C059FC9654FCBB8904BFCB54C850B2F94046BD9BA2743A021: {
                flags: {
                  sellToken: false,
                },
                index: "AA12128D6A55784C059FC9654FCBB8904BFCB54C850B2F94046BD9BA2743A021",
                nftokenID: "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF16E5DA9C00000001",
                owner: "rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw",
              },
            },
            nftokens: {
              "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF16E5DA9C00000001": {
                flags: {
                  burnable: true,
                  onlyXRP: true,
                  transferable: true,
                  trustLine: false,
                },
                issuer: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
                nftokenID: "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF16E5DA9C00000001",
                nftokenTaxon: 0,
                sequence: 1,
                transferFee: 0,
              },
            },
          },
          orderbookChanges: {},
          result: "tesSUCCESS",
          timestamp: "2022-03-04T15:01:20.000Z",
        },
        sequence: 75147,
        specification: {
          nftokenBuyOffer: "AA12128D6A55784C059FC9654FCBB8904BFCB54C850B2F94046BD9BA2743A021",
        },
        type: "nftokenAcceptOffer",
      });
    });

    it("NFTokenAcceptOfferSell", function () {
      const tx = require("../examples/responses/NFTokenAcceptOfferSell.json");
      const result: any = Models.getTxDetails(tx, false);

      expect(result).to.eql({
        address: "rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw",
        id: "F3B39252F4F13BAE93AB82E55DF8EB701AF4980FB6F38EB81889285B10DDEB5E",
        outcome: {
          balanceChanges: { rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw: [{ currency: "XRP", value: "-0.000012" }] },
          lockedBalanceChanges: {},
          fee: "0.000012",
          indexInLedger: 0,
          ledgerVersion: 1310248,
          nftokenChanges: {
            r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3: [
              {
                status: "removed",
                nftokenID: "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC90000099B00000000",
                uri: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
              },
            ],
            rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw: [
              {
                status: "added",
                nftokenID: "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC90000099B00000000",
                uri: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
              },
            ],
          },
          nftokenOfferChanges: {
            r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3: [
              {
                owner: "r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3",
                amount: "0",
                flags: 1,
                status: "deleted",
                nftokenID: "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC90000099B00000000",
                index: "D3C21058E60B6597BCB33A7A77B5FC90959082C96057EDBB388CE365E8D3245D",
              },
            ],
          },
          orderbookChanges: {},
          affectedObjects: {
            nftokenOffers: {
              D3C21058E60B6597BCB33A7A77B5FC90959082C96057EDBB388CE365E8D3245D: {
                flags: {
                  sellToken: true,
                },
                index: "D3C21058E60B6597BCB33A7A77B5FC90959082C96057EDBB388CE365E8D3245D",
                nftokenID: "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC90000099B00000000",
                owner: "r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3",
              },
            },
            nftokens: {
              "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC90000099B00000000": {
                flags: {
                  burnable: true,
                  onlyXRP: true,
                  transferable: true,
                  trustLine: false,
                },
                issuer: "r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3",
                nftokenID: "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC90000099B00000000",
                nftokenTaxon: 0,
                sequence: 0,
                transferFee: 0,
              },
            },
          },
          result: "tesSUCCESS",
          timestamp: "2022-03-01T09:38:41.000Z",
        },
        sequence: 980203,
        specification: {
          nftokenSellOffer: "D3C21058E60B6597BCB33A7A77B5FC90959082C96057EDBB388CE365E8D3245D",
        },
        type: "nftokenAcceptOffer",
      });
    });

    it("NFTokenBurn", function () {
      const tx = require("../examples/responses/NFTokenBurn.json");
      const result: any = Models.getTxDetails(tx, false);

      expect(result).to.eql({
        type: "nftokenBurn",
        address: "r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3",
        sequence: 1309362,
        id: "5139E9A51978E786FDB97D73F6245A11438A373133AC33A25D50F8E2C7AA5FEA",
        specification: {
          account: "r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3",
          nftokenID: "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC916E5DA9C00000001",
        },
        outcome: {
          result: "tesSUCCESS",
          timestamp: "2022-03-01T09:44:31.000Z",
          fee: "0.000012",
          balanceChanges: { r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3: [{ currency: "XRP", value: "-0.000012" }] },
          lockedBalanceChanges: {},
          orderbookChanges: {},
          nftokenChanges: {
            r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3: [
              {
                status: "removed",
                nftokenID: "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC916E5DA9C00000001",
                uri: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
              },
            ],
          },
          nftokenOfferChanges: {},
          affectedObjects: {
            nftokens: {
              "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC916E5DA9C00000001": {
                flags: {
                  burnable: true,
                  onlyXRP: true,
                  transferable: true,
                  trustLine: false,
                },
                issuer: "r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3",
                nftokenID: "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC916E5DA9C00000001",
                nftokenTaxon: 0,
                sequence: 1,
                transferFee: 0,
              },
            },
          },
          ledgerVersion: 1310364,
          indexInLedger: 0,
        },
      });
    });

    it("NFTokenCreateOfferBuy", function () {
      const tx = require("../examples/responses/NFTokenCreateOfferBuy.json");
      const result: any = Models.getTxDetails(tx, false);

      expect(result).to.eql({
        type: "nftokenCreateOffer",
        address: "rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw",
        sequence: 75150,
        id: "9009887ACAEA08E7DE821CF15C410670E8469A98695FC33DCB8A86096930A4AF",
        specification: {
          nftokenID: "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF16E5DA9C00000001",
          amount: "1",
          owner: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
          flags: { sellToken: false },
        },
        outcome: {
          result: "tesSUCCESS",
          timestamp: "2022-03-04T14:57:00.000Z",
          fee: "0.000012",
          balanceChanges: { rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw: [{ currency: "XRP", value: "-0.000012" }] },
          lockedBalanceChanges: {},
          orderbookChanges: {},
          nftokenChanges: {},
          nftokenOfferChanges: {
            rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw: [
              {
                status: "created",
                amount: "1",
                nftokenID: "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF16E5DA9C00000001",
                owner: "rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw",
                index: "AA12128D6A55784C059FC9654FCBB8904BFCB54C850B2F94046BD9BA2743A021",
              },
            ],
          },
          affectedObjects: {
            nftokenOffers: {
              AA12128D6A55784C059FC9654FCBB8904BFCB54C850B2F94046BD9BA2743A021: {
                flags: {
                  sellToken: false,
                },
                index: "AA12128D6A55784C059FC9654FCBB8904BFCB54C850B2F94046BD9BA2743A021",
                nftokenID: "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF16E5DA9C00000001",
                owner: "rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw",
              },
            },
            nftokens: {
              "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF16E5DA9C00000001": {
                flags: {
                  burnable: true,
                  onlyXRP: true,
                  transferable: true,
                  trustLine: false,
                },
                issuer: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
                nftokenID: "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF16E5DA9C00000001",
                nftokenTaxon: 0,
                sequence: 1,
                transferFee: 0,
              },
            },
          },
          ledgerVersion: 75358,
          indexInLedger: 0,
        },
      });
    });

    it("NFTokenCreateOfferSellDestination", function () {
      const tx = require("../examples/responses/NFTokenCreateOfferSellDestination.json");
      const result: any = Models.getTxDetails(tx, false);

      expect(result).to.eql({
        type: "nftokenCreateOffer",
        address: "rDruU1JTwpxc7dxhWmAFFKJpq3BwreFAFg",
        sequence: 908,
        id: "37DD2EC688DA77902D1472373C66226594CC5AC0347DB337A122FF3E6F2865F0",
        specification: {
          nftokenID: "0008000083CD166E1806EF2076C55077AEFD418E771A516C0000099B00000000",
          amount: "0",
          destination: "rKndKCQ3KHWMkRMmhhvRAEZuT2nepTctxw",
          expiration: 5241652095,
          flags: { sellToken: true },
        },
        outcome: {
          result: "tesSUCCESS",
          timestamp: "2022-03-02T00:52:00.000Z",
          fee: "0.000012",
          balanceChanges: { rDruU1JTwpxc7dxhWmAFFKJpq3BwreFAFg: [{ currency: "XRP", value: "-0.000012" }] },
          lockedBalanceChanges: {},
          orderbookChanges: {},
          nftokenChanges: {},
          nftokenOfferChanges: {
            rDruU1JTwpxc7dxhWmAFFKJpq3BwreFAFg: [
              {
                status: "created",
                flags: 1,
                nftokenID: "0008000083CD166E1806EF2076C55077AEFD418E771A516C0000099B00000000",
                owner: "rDruU1JTwpxc7dxhWmAFFKJpq3BwreFAFg",
                index: "5770CF1626D6C26E965C05AE9B4686DB835565AE323C116A1771E80E8F2EFE25",
                destination: "rKndKCQ3KHWMkRMmhhvRAEZuT2nepTctxw",
                expiration: 5241652095,
              },
            ],
          },
          affectedObjects: {
            nftokenOffers: {
              "5770CF1626D6C26E965C05AE9B4686DB835565AE323C116A1771E80E8F2EFE25": {
                flags: {
                  sellToken: true,
                },
                index: "5770CF1626D6C26E965C05AE9B4686DB835565AE323C116A1771E80E8F2EFE25",
                nftokenID: "0008000083CD166E1806EF2076C55077AEFD418E771A516C0000099B00000000",
                owner: "rDruU1JTwpxc7dxhWmAFFKJpq3BwreFAFg",
              },
            },
            nftokens: {
              "0008000083CD166E1806EF2076C55077AEFD418E771A516C0000099B00000000": {
                flags: {
                  burnable: false,
                  onlyXRP: false,
                  transferable: true,
                  trustLine: false,
                },
                issuer: "rDruU1JTwpxc7dxhWmAFFKJpq3BwreFAFg",
                nftokenID: "0008000083CD166E1806EF2076C55077AEFD418E771A516C0000099B00000000",
                nftokenTaxon: 0,
                sequence: 0,
                transferFee: 0,
              },
            },
          },
          ledgerVersion: 1104,
          indexInLedger: 0,
        },
      });
    });

    it("NFTokenCreateOfferBuyIOU", function () {
      const tx = require("../examples/responses/NFTokenCreateOfferBuyIOU.json");
      const result: any = Models.getTxDetails(tx, false);

      expect(result).to.eql({
        type: "nftokenCreateOffer",
        address: "rDruU1JTwpxc7dxhWmAFFKJpq3BwreFAFg",
        sequence: 909,
        id: "AF749F0704733FCD442128D7792EC1F5CF8FDFF4ACC9C0BE5B4C6AF68DE811FF",
        specification: {
          nftokenID: "0008000083CD166E1806EF2076C55077AEFD418E771A516C0000099B00000000",
          amount: {
            currency: "EVR",
            issuer: "rHdSF3FWTFR11zZ4dPy17Rch1Ygch3gy8p",
            value: "-2560",
          },
          owner: "rKndKCQ3KHWMkRMmhhvRAEZuT2nepTctxw",
          expiration: 5241652095,
          flags: { sellToken: false },
        },
        outcome: {
          result: "tesSUCCESS",
          timestamp: "2022-03-02T00:57:30.000Z",
          fee: "0.000012",
          balanceChanges: { rDruU1JTwpxc7dxhWmAFFKJpq3BwreFAFg: [{ currency: "XRP", value: "-0.000012" }] },
          lockedBalanceChanges: {},
          orderbookChanges: {},
          nftokenChanges: {},
          nftokenOfferChanges: {
            rDruU1JTwpxc7dxhWmAFFKJpq3BwreFAFg: [
              {
                status: "created",
                amount: {
                  currency: "EVR",
                  issuer: "rHdSF3FWTFR11zZ4dPy17Rch1Ygch3gy8p",
                  value: "-2560",
                },
                nftokenID: "0008000083CD166E1806EF2076C55077AEFD418E771A516C0000099B00000000",
                owner: "rDruU1JTwpxc7dxhWmAFFKJpq3BwreFAFg",
                index: "81B2D5752716704EA92506003F3F58E51B795BE9DADB2698471700FF8FD4B5F6",
                expiration: 5241652095,
              },
            ],
          },
          affectedObjects: {
            nftokenOffers: {
              "81B2D5752716704EA92506003F3F58E51B795BE9DADB2698471700FF8FD4B5F6": {
                flags: {
                  sellToken: false,
                },
                index: "81B2D5752716704EA92506003F3F58E51B795BE9DADB2698471700FF8FD4B5F6",
                nftokenID: "0008000083CD166E1806EF2076C55077AEFD418E771A516C0000099B00000000",
                owner: "rDruU1JTwpxc7dxhWmAFFKJpq3BwreFAFg",
              },
            },
            nftokens: {
              "0008000083CD166E1806EF2076C55077AEFD418E771A516C0000099B00000000": {
                flags: {
                  burnable: false,
                  onlyXRP: false,
                  transferable: true,
                  trustLine: false,
                },
                issuer: "rDruU1JTwpxc7dxhWmAFFKJpq3BwreFAFg",
                nftokenID: "0008000083CD166E1806EF2076C55077AEFD418E771A516C0000099B00000000",
                nftokenTaxon: 0,
                sequence: 0,
                transferFee: 0,
              },
            },
          },
          ledgerVersion: 1214,
          indexInLedger: 0,
        },
      });
    });

    it("NFTokenCancelOffer", function () {
      const tx = require("../examples/responses/NFTokenCancelOffer.json");
      const result: any = Models.getTxDetails(tx, false);

      expect(result).to.eql({
        type: "nftokenCancelOffer",
        address: "r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3",
        sequence: 1309351,
        id: "B88123B63CF0FAD1549E17A50C2F51A6B6EB4ADFC85EEAEF1EDCFBA62E1A1882",
        specification: { nftokenOffers: ["D3789371E082D2DF4B49AA853E31D3A7E86A1D3B8C5531C160AF5B62AA2B8CA8"] },
        outcome: {
          result: "tesSUCCESS",
          timestamp: "2022-03-01T09:00:10.000Z",
          fee: "0.000012",
          balanceChanges: { r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3: [{ currency: "XRP", value: "-0.000012" }] },
          lockedBalanceChanges: {},
          orderbookChanges: {},
          nftokenChanges: {},
          nftokenOfferChanges: {
            r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3: [
              {
                status: "deleted",
                amount: "1000000000000000",
                flags: 1,
                nftokenID: "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC90000099B00000000",
                owner: "r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3",
                index: "D3789371E082D2DF4B49AA853E31D3A7E86A1D3B8C5531C160AF5B62AA2B8CA8",
              },
            ],
          },
          affectedObjects: {
            nftokenOffers: {
              D3789371E082D2DF4B49AA853E31D3A7E86A1D3B8C5531C160AF5B62AA2B8CA8: {
                flags: {
                  sellToken: true,
                },
                index: "D3789371E082D2DF4B49AA853E31D3A7E86A1D3B8C5531C160AF5B62AA2B8CA8",
                nftokenID: "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC90000099B00000000",
                owner: "r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3",
              },
            },
            nftokens: {
              "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC90000099B00000000": {
                flags: {
                  burnable: true,
                  onlyXRP: true,
                  transferable: true,
                  trustLine: false,
                },
                issuer: "r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3",
                nftokenID: "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC90000099B00000000",
                nftokenTaxon: 0,
                sequence: 0,
                transferFee: 0,
              },
            },
          },
          ledgerVersion: 1309479,
          indexInLedger: 0,
        },
      });
    });

    it("AccountSetMinter", function () {
      const tx = require("../examples/responses/AccountSetMinter.json");
      const result: any = Models.getTxDetails(tx, false);

      expect(result).to.eql({
        address: "rHuR2oGL34Wr4DK7z3bBCbCEVqD4ihVhmz",
        id: "18B19F840ED19A27F539006412A5D61986F27B2C2A71A73AA4ED6869009D6BB0",
        outcome: {
          balanceChanges: { rHuR2oGL34Wr4DK7z3bBCbCEVqD4ihVhmz: [{ currency: "XRP", value: "-0.000015" }] },
          lockedBalanceChanges: {},
          fee: "0.000015",
          indexInLedger: 0,
          ledgerVersion: 44093,
          nftokenChanges: {},
          nftokenOfferChanges: {},
          orderbookChanges: {},
          result: "tesSUCCESS",
          timestamp: "2022-03-03T12:47:41.000Z",
        },
        sequence: 42030,
        specification: {
          nftokenMinter: "rrrrrrrrrrrrrrrrrrrrrhoLvTp",
        },
        type: "settings",
      });
    });

    it("OfferCreate", function () {
      const tx = require("../examples/responses/OfferCreate.json");
      const result: any = Models.getTxDetails(tx, false);

      expect(result).to.eql({
        address: "rogue5HnPRSszD9CWGSUz8UGHMVwSSKF6",
        id: "6EAA2BB437916CF9CE6F182D1E411D81A37601B789DB9B3638E0D1B989E7B75E",
        outcome: {
          balanceChanges: {
            rBithomp3UNknnjo8HKNfyS5MN4kdPTZpW: [
              { counterparty: "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z", currency: "BTH", value: "-0.059286072222" },
              { counterparty: "rogue5HnPRSszD9CWGSUz8UGHMVwSSKF6", currency: "BTH", value: "0.05928607222222222" },
            ],
            rogue5HnPRSszD9CWGSUz8UGHMVwSSKF6: [
              { counterparty: "rBithomp3UNknnjo8HKNfyS5MN4kdPTZpW", currency: "BTH", value: "-0.05928607222222222" },
              { currency: "XRP", value: "53.347465" },
            ],
            rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z: [
              { counterparty: "rBithomp3UNknnjo8HKNfyS5MN4kdPTZpW", currency: "BTH", value: "0.059286072222" },
              { currency: "XRP", value: "-53.357465" },
            ],
          },
          lockedBalanceChanges: {},
          fee: "0.01",
          indexInLedger: 7,
          ledgerVersion: 62799452,
          nftokenChanges: {},
          nftokenOfferChanges: {},
          orderbookChanges: {
            rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z: [
              {
                direction: "buy",
                quantity: {
                  currency: "BTH",
                  counterparty: "rBithomp3UNknnjo8HKNfyS5MN4kdPTZpW",
                  value: "0.0592860722222222",
                },
                totalPrice: {
                  currency: "XRP",
                  value: "53.357465",
                },
                sequence: 282,
                status: "filled",
                makerExchangeRate: "0.001111111111111111",
              },
            ],
          },
          result: "tesSUCCESS",
          timestamp: "2021-04-10T07:23:30.000Z",
        },
        sequence: 1733045,
        specification: {
          direction: "sell",
          immediateOrCancel: true,
          memos: [
            {
              data: "\u001fϫ�\u001b��?|}�u\u001b�҉vR�\t\u0000\u0000\u0001\u001a@�\u001f��*��?�Z�}���@J��i�;y?�\u0000\u0000\u0000\u0000\u0000\u0000",
            },
          ],
          quantity: {
            counterparty: "rBithomp3UNknnjo8HKNfyS5MN4kdPTZpW",
            currency: "BTH",
            value: "0.07712338548602358",
          },
          totalPrice: {
            currency: "XRP",
            value: "63.100951",
          },
        },
        type: "order",
      });
    });

    it("PaymentChannelCreate", function () {
      const tx = require("../examples/responses/PaymentChannelCreate.json");
      const result: any = Models.getTxDetails(tx, false);

      expect(result).to.eql({
        type: "paymentChannelCreate",
        address: "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
        sequence: 382,
        id: "711C4F606C63076137FAE90ADC36379D7066CF551E96DA6FE2BDAB5ECBFACF2B",
        specification: {
          amount: "0.001",
          destination: "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
          settleDelay: 60,
          publicKey: "03CFD18E689434F032A4E84C63E2A3A6472D684EAF4FD52CA67742F3E24BAE81B2",
        },
        outcome: {
          result: "tesSUCCESS",
          timestamp: "2021-03-04T00:27:51.000Z",
          fee: "0.00001",
          balanceChanges: { rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn: [{ currency: "XRP", value: "-0.00101" }] },
          lockedBalanceChanges: {},
          orderbookChanges: {},
          channelChanges: {
            status: "created",
            channelId: "C7F634794B79DB40E87179A9D1BF05D05797AE7E92DF8E93FD6656E8C4BE3AE7",
            source: "rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn",
            destination: "ra5nK24KXen9AHvsdFTKHSANinZseWnPcX",
            channelAmountDrops: "1000",
            channelBalanceDrops: "0",
          },
          nftokenChanges: {},
          nftokenOfferChanges: {},
          ledgerVersion: 61965340,
          indexInLedger: 0,
        },
      });
    });

    it("EscrowCreate IOU", function () {
      const tx = require("../examples/responses/transaction/885CDCF781073DB9306A4B5FF61F358AE1B2452B57B7FACC090DF91125CC86D6.json");
      const result: any = Models.getTxDetails(tx, false);

      expect(result).to.eql({
        type: "escrowCreation",
        address: "r9N4v3cWxfh4x6yUNjxNy3DbWUgbzMBLdk",
        sequence: 3334565,
        id: "885CDCF781073DB9306A4B5FF61F358AE1B2452B57B7FACC090DF91125CC86D6",
        specification: {
          amount: {
            counterparty: "rM3YFJAHYBufChMHsBLZzwzg7a2oBCP7vV",
            currency: "546F6B656E466F72457363726F77000000000000",
            value: "10",
          },
          destination: "r9N4v3cWxfh4x6yUNjxNy3DbWUgbzMBLdk",
          allowExecuteAfter: "2022-06-22T10:16:00.000Z",
        },
        outcome: {
          result: "tesSUCCESS",
          timestamp: "2022-06-22T10:09:50.000Z",
          fee: "0.000015",
          balanceChanges: { r9N4v3cWxfh4x6yUNjxNy3DbWUgbzMBLdk: [{ currency: "XRP", value: "-0.000015" }] },
          lockedBalanceChanges: {
            r9N4v3cWxfh4x6yUNjxNy3DbWUgbzMBLdk: [
              {
                counterparty: "rM3YFJAHYBufChMHsBLZzwzg7a2oBCP7vV",
                currency: "546F6B656E466F72457363726F77000000000000",
                value: "10",
              },
            ],
          },
          orderbookChanges: {},
          nftokenChanges: {},
          nftokenOfferChanges: {},
          ledgerVersion: 3530986,
          indexInLedger: 0,
        },
      });
    });

    it("EscrowFinish IOU", function () {
      const tx = require("../examples/responses/transaction/CB192FC862D00F6A49E819EF99053BE534A6EC703418306E415C6230F5786FDB.json");
      const result: any = Models.getTxDetails(tx, false);

      expect(result).to.eql({
        type: "escrowExecution",
        address: "rELeasERs3m4inA1UinRLTpXemqyStqzwh",
        sequence: 3334670,
        id: "CB192FC862D00F6A49E819EF99053BE534A6EC703418306E415C6230F5786FDB",
        specification: {
          owner: "r9N4v3cWxfh4x6yUNjxNy3DbWUgbzMBLdk",
          escrowSequence: 3334565,
        },
        outcome: {
          result: "tesSUCCESS",
          timestamp: "2022-06-22T11:05:02.000Z",
          fee: "0.000012",
          balanceChanges: { rELeasERs3m4inA1UinRLTpXemqyStqzwh: [{ currency: "XRP", value: "-0.000012" }] },
          lockedBalanceChanges: {
            r9N4v3cWxfh4x6yUNjxNy3DbWUgbzMBLdk: [
              {
                counterparty: "rM3YFJAHYBufChMHsBLZzwzg7a2oBCP7vV",
                currency: "546F6B656E466F72457363726F77000000000000",
                value: "-10",
              },
            ],
          },
          orderbookChanges: {},
          nftokenChanges: {},
          nftokenOfferChanges: {},
          ledgerVersion: 3532083,
          indexInLedger: 1,
        },
      });
    });

    it("Settings with Memo", function () {
      const tx = require("../examples/responses/transaction/E5535D1C02FAAB40F0B7652DC7EB86D1366B13D4517A7305F53BC664C686351A.json");
      const result: any = Models.getTxDetails(tx, false);

      expect(result).to.eql({
        type: "settings",
        address: "r4eecBHFbkHpLQEvSnB93bc3C2SVMjVKie",
        sequence: 70867870,
        id: "E5535D1C02FAAB40F0B7652DC7EB86D1366B13D4517A7305F53BC664C686351A",
        specification: {
          memos: [
            {
              data: "LEDGER2",
              type: "[https://xrpl.services]-Memo",
            },
          ],
          regularKey: "rJ6kUAyW5uzxM1yjHtjXVYRscM9pogCt1C",
        },
        outcome: {
          result: "tesSUCCESS",
          timestamp: "2022-04-09T06:46:40.000Z",
          fee: "0.000015",
          balanceChanges: { r4eecBHFbkHpLQEvSnB93bc3C2SVMjVKie: [{ currency: "XRP", value: "-0.000015" }] },
          lockedBalanceChanges: {},
          orderbookChanges: {},
          nftokenChanges: {},
          nftokenOfferChanges: {},
          ledgerVersion: 70868873,
          indexInLedger: 21,
        },
      });
    });
  });

  describe("getLedgerTxDetails", () => {
    it("NFTokenMint from ledger history", function () {
      const tx = require("../examples/responses/LedgerNFTokenMint.json");
      const result: any = Models.getLedgerTxDetails(tx, 593274, 701280821, false);

      expect(result).to.eql({
        address: "rJzaNs8UpjuC65H3wwfjQ1zqTBVpt2umMy",
        id: "1618B0147FC0F56A33ACE7F06503D9A41A52E1E6BB024404C04354E40B633855",
        outcome: {
          result: "tesSUCCESS",
          timestamp: "2022-03-22T16:13:41.000Z",
          balanceChanges: { rJzaNs8UpjuC65H3wwfjQ1zqTBVpt2umMy: [{ currency: "XRP", value: "-0.0001" }] },
          lockedBalanceChanges: {},
          fee: "0.0001",
          indexInLedger: 0,
          ledgerVersion: 593274,
          nftokenChanges: {
            rJzaNs8UpjuC65H3wwfjQ1zqTBVpt2umMy: [
              {
                status: "added",
                nftokenID: "000A0000C54635B0A3EF854BD72AD1A192DBC9EBC5DF262F2DCBAB9D00000002",
                uri: "6E6F736A2E3261356264383636326633332D646639622D333931342D326234302D65306530343133332F73617461646174656D74666E2F6C6169636F732E72656469762E76656474666E2E6E64632F2F3A7370747468",
              },
            ],
          },
          nftokenOfferChanges: {},
          affectedObjects: {
            nftokens: {
              "000A0000C54635B0A3EF854BD72AD1A192DBC9EBC5DF262F2DCBAB9D00000002": {
                flags: {
                  burnable: false,
                  onlyXRP: true,
                  transferable: true,
                  trustLine: false,
                },
                issuer: "rJzaNs8UpjuC65H3wwfjQ1zqTBVpt2umMy",
                nftokenID: "000A0000C54635B0A3EF854BD72AD1A192DBC9EBC5DF262F2DCBAB9D00000002",
                nftokenTaxon: 0,
                sequence: 2,
                transferFee: 0,
              },
            },
          },
          orderbookChanges: {},
        },
        sequence: 1238,
        specification: {
          flags: {
            burnable: false,
            onlyXRP: true,
            transferable: true,
            trustLine: false,
          },
          nftokenTaxon: 0,
          transferFee: 0,
          uri: "6E6F736A2E3261356264383636326633332D646639622D333931342D326234302D65306530343133332F73617461646174656D74666E2F6C6169636F732E72656469762E76656474666E2E6E64632F2F3A7370747468",
        },
        type: "nftokenMint",
      });
    });
  });

  describe("getStreamTxDetails", () => {
    it("works", function () {
      const tx = require("../examples/responses/streamTransaction/E506D86886818A6F52DACE3753EB6824F1DADD5B3B1D39C7D98DA072D9B48AB3.json");
      const result: any = Models.getStreamTxDetails(tx, false);
      expect(result).to.eql({
        type: "payment",
        address: "rULQj9eStEKAhF5qugaAwadh5enRwDyf1i",
        sequence: 68840787,
        id: "9BAFE443078D105AB49C2BF92D0DD04BF73DCC0ADF6CA67CE728CE762059E6B7",
        specification: {
          source: {
            address: "rULQj9eStEKAhF5qugaAwadh5enRwDyf1i",
            maxAmount: {
              currency: "4C53474400000000000000000000000000000000",
              value: "37907",
              counterparty: "rnyGDFEqnNwpyzievKCMhHUi4xs6HnUqPA",
            },
          },
          destination: {
            address: "r3pZSivmsTG3D3sTJZASkJcfpL7eLq4Y9V",
          },
        },
        outcome: {
          result: "tesSUCCESS",
          timestamp: "2022-04-25T11:53:22.000Z",
          fee: "0.00001",
          balanceChanges: {
            rnyGDFEqnNwpyzievKCMhHUi4xs6HnUqPA: [
              {
                counterparty: "rULQj9eStEKAhF5qugaAwadh5enRwDyf1i",
                currency: "4C53474400000000000000000000000000000000",
                value: "37907",
              },
              {
                counterparty: "r3pZSivmsTG3D3sTJZASkJcfpL7eLq4Y9V",
                currency: "4C53474400000000000000000000000000000000",
                value: "-37907",
              },
            ],
            rULQj9eStEKAhF5qugaAwadh5enRwDyf1i: [
              {
                counterparty: "rnyGDFEqnNwpyzievKCMhHUi4xs6HnUqPA",
                currency: "4C53474400000000000000000000000000000000",
                value: "-37907",
              },
              { currency: "XRP", value: "-0.00001" },
            ],
            r3pZSivmsTG3D3sTJZASkJcfpL7eLq4Y9V: [
              {
                counterparty: "rnyGDFEqnNwpyzievKCMhHUi4xs6HnUqPA",
                currency: "4C53474400000000000000000000000000000000",
                value: "37907",
              },
            ],
          },
          lockedBalanceChanges: {},
          orderbookChanges: {},
          nftokenChanges: {},
          nftokenOfferChanges: {},
          ledgerVersion: 71226014,
          indexInLedger: 92,
          deliveredAmount: {
            currency: "4C53474400000000000000000000000000000000",
            value: "37907",
            counterparty: "rnyGDFEqnNwpyzievKCMhHUi4xs6HnUqPA",
          },
        },
      });
    });
  });

  describe("parseNFTokenChanges", () => {
    it("NFTokenMint", function () {
      const tx = require("../examples/responses/NFTokenMint.json");
      const result: any = Models.parseNFTokenChanges(tx);

      expect(result).to.eql({
        r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3: [
          {
            status: "added",
            nftokenID: "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC90000099B00000000",
            uri: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
          },
        ],
      });
    });

    it("NFTokenMint2", function () {
      const tx = require("../examples/responses/NFTokenMint2.json");
      const result: any = Models.parseNFTokenChanges(tx);

      expect(result).to.eql({
        rESS19Edm58UGdnJq1ZYmVRbQJ2MYtYrR6: [
          {
            status: "added",
            nftokenID: "000900019E61C02982121EF82C5C610BADAF3DDEE35693A8DCBA29BB00000020",
            uri: "4E4654206D696E742074657374",
          },
        ],
      });
    });

    it("NFTokenBurn", function () {
      const tx = require("../examples/responses/NFTokenBurn.json");
      const result: any = Models.parseNFTokenChanges(tx);

      expect(result).to.eql({
        r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3: [
          {
            status: "removed",
            nftokenID: "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC916E5DA9C00000001",
            uri: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
          },
        ],
      });
    });

    it("NFTokenAcceptOfferSell", function () {
      const tx = require("../examples/responses/NFTokenAcceptOfferSell.json");
      const result: any = Models.parseNFTokenChanges(tx);

      expect(result).to.eql({
        rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw: [
          {
            status: "added",
            nftokenID: "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC90000099B00000000",
            uri: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
          },
        ],
        r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3: [
          {
            status: "removed",
            nftokenID: "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC90000099B00000000",
            uri: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
          },
        ],
      });
    });

    it("NFTokenAcceptOfferSell2", function () {
      const tx = require("../examples/responses/NFTokenAcceptOfferSell2.json");
      const result: any = Models.parseNFTokenChanges(tx);

      expect(result).to.eql({
        rDruU1JTwpxc7dxhWmAFFKJpq3BwreFAFg: [
          {
            status: "removed",
            nftokenID: "0008000083CD166E1806EF2076C55077AEFD418E771A516C0000099B00000000",
            uri: "E090D96F2BBC2741ED41EE5C8A55D3EC2D6FF92A60524C9856A2FEAA14A07B9D",
          },
        ],
        rKndKCQ3KHWMkRMmhhvRAEZuT2nepTctxw: [
          {
            status: "added",
            nftokenID: "0008000083CD166E1806EF2076C55077AEFD418E771A516C0000099B00000000",
            uri: "E090D96F2BBC2741ED41EE5C8A55D3EC2D6FF92A60524C9856A2FEAA14A07B9D",
          },
        ],
      });
    });

    it("NFTokenAcceptOfferBuy with creation", function () {
      const tx = require("../examples/responses/NFTokenAcceptOfferBuy.json");
      const result: any = Models.parseNFTokenChanges(tx);

      expect(result).to.eql({
        rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz: [
          {
            status: "removed",
            nftokenID: "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF16E5DA9C00000001",
            uri: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
          },
        ],
        rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw: [
          {
            status: "added",
            nftokenID: "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF16E5DA9C00000001",
            uri: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
          },
        ],
      });
    });

    it("NFTokenAcceptOfferBuy with modification", function () {
      const tx = require("../examples/responses/NFTokenAcceptOfferBuy2.json");
      const result: any = Models.parseNFTokenChanges(tx);

      expect(result).to.eql({
        rJbTejsLuGzyrQ9Hq2s8RX47gPQuCoZQCw: [
          {
            status: "removed",
            nftokenID: "00090001C0FE87162DAD000D42613DD2C14AFC7FB4DA10CA0000099B00000000",
            uri: "4E4654207374726573732074657374",
          },
        ],
        rhuWFE9dkvj5NT7TWSdjwcYmnKvdTjBKyh: [
          {
            status: "added",
            nftokenID: "00090001C0FE87162DAD000D42613DD2C14AFC7FB4DA10CA0000099B00000000",
            uri: "4E4654207374726573732074657374",
          },
        ],
      });
    });

    it("NFTokenAcceptOfferBuy multipages", function () {
      const tx = require("../examples/responses/NFTokenAcceptOfferBuy3.json");
      const result: any = Models.parseNFTokenChanges(tx);

      expect(result).to.eql({
        r4K2ggLxfX8vp5vEi3sDEeAQg3PGEH84WV: [
          {
            status: "removed",
            nftokenID: "00090001E9DE3F31905919768FAB16D17D15DFA911D48C16343168CA0000002F",
            uri: "4E4654206D696E742074657374",
          },
        ],
        rNDZcpmnXG3zCLKtWqYE9LNNQRZrtLtjx2: [
          {
            status: "added",
            nftokenID: "00090001E9DE3F31905919768FAB16D17D15DFA911D48C16343168CA0000002F",
            uri: "4E4654206D696E742074657374",
          },
        ],
      });
    });

    it("NFTokenAcceptOfferBuy multipages", function () {
      const tx = require("../examples/responses/NFTokenAcceptOfferBuy4.json");
      const result: any = Models.parseNFTokenChanges(tx);

      expect(result).to.eql({
        rQrTtbNKcNW8occaRaVB3vreqJSKZDynnq: [
          {
            status: "removed",
            nftokenID: "00090001FC6156D85FCBBBEF1E2AEE70E41EEDE24DE6D1E1577748AA0000000F",
            uri: "4E4654206D696E742074657374",
          },
        ],
        rGKaqNwqtRjy1MWpS4aZWQymebCHdiNX8b: [
          {
            status: "added",
            nftokenID: "00090001FC6156D85FCBBBEF1E2AEE70E41EEDE24DE6D1E1577748AA0000000F",
            uri: "4E4654206D696E742074657374",
          },
        ],
      });
    });

    it("NFTokenCreateOfferSell", function () {
      const tx = require("../examples/responses/NFTokenCreateOfferSell.json");
      const result: any = Models.parseNFTokenChanges(tx);

      expect(result).to.eql({});
    });

    it("NFTokenCreateOfferBuy", function () {
      const tx = require("../examples/responses/NFTokenCreateOfferBuy.json");
      const result: any = Models.parseNFTokenChanges(tx);

      expect(result).to.eql({});
    });

    it("NFTokenCancelOffer", function () {
      const tx = require("../examples/responses/NFTokenCancelOffer.json");
      const result: any = Models.parseNFTokenChanges(tx);

      expect(result).to.eql({});
    });
  });

  describe("parseNFTokenOfferChanges", () => {
    it("NFTokenMint", function () {
      const tx = require("../examples/responses/NFTokenMint.json");
      const result: any = Models.parseNFTokenOfferChanges(tx);

      expect(result).to.eql({});
    });

    it("NFTokenBurn", function () {
      const tx = require("../examples/responses/NFTokenBurn.json");
      const result: any = Models.parseNFTokenOfferChanges(tx);

      expect(result).to.eql({});
    });

    it("NFTokenCancelOffer", function () {
      const tx = require("../examples/responses/NFTokenCancelOffer.json");
      const result: any = Models.parseNFTokenOfferChanges(tx);

      expect(result).to.eql({
        r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3: [
          {
            status: "deleted",
            owner: "r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3",
            amount: "1000000000000000",
            flags: 1,
            nftokenID: "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC90000099B00000000",
            index: "D3789371E082D2DF4B49AA853E31D3A7E86A1D3B8C5531C160AF5B62AA2B8CA8",
          },
        ],
      });
    });

    it("NFTokenCreateOfferSell", function () {
      const tx = require("../examples/responses/NFTokenCreateOfferSell.json");
      const result: any = Models.parseNFTokenOfferChanges(tx);

      expect(result).to.eql({
        r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3: [
          {
            status: "created",
            owner: "r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3",
            amount: "1000000000000000",
            flags: 1,
            nftokenID: "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC90000099B00000000",
            index: "D3789371E082D2DF4B49AA853E31D3A7E86A1D3B8C5531C160AF5B62AA2B8CA8",
          },
        ],
      });
    });

    it("NFTokenCreateOfferSellDestination", function () {
      const tx = require("../examples/responses/NFTokenCreateOfferSellDestination.json");
      const result: any = Models.parseNFTokenOfferChanges(tx);

      expect(result).to.eql({
        rDruU1JTwpxc7dxhWmAFFKJpq3BwreFAFg: [
          {
            status: "created",
            owner: "rDruU1JTwpxc7dxhWmAFFKJpq3BwreFAFg",
            destination: "rKndKCQ3KHWMkRMmhhvRAEZuT2nepTctxw",
            expiration: 5241652095,
            flags: 1,
            nftokenID: "0008000083CD166E1806EF2076C55077AEFD418E771A516C0000099B00000000",
            index: "5770CF1626D6C26E965C05AE9B4686DB835565AE323C116A1771E80E8F2EFE25",
          },
        ],
      });
    });

    it("NFTokenCreateOfferBuy", function () {
      const tx = require("../examples/responses/NFTokenCreateOfferBuy.json");
      const result: any = Models.parseNFTokenOfferChanges(tx);

      expect(result).to.eql({
        rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw: [
          {
            status: "created",
            owner: "rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw",
            amount: "1",
            nftokenID: "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF16E5DA9C00000001",
            index: "AA12128D6A55784C059FC9654FCBB8904BFCB54C850B2F94046BD9BA2743A021",
          },
        ],
      });
    });

    it("NFTokenCreateOfferBuyIOU", function () {
      const tx = require("../examples/responses/NFTokenCreateOfferBuyIOU.json");
      const result: any = Models.parseNFTokenOfferChanges(tx);

      expect(result).to.eql({
        rDruU1JTwpxc7dxhWmAFFKJpq3BwreFAFg: [
          {
            status: "created",
            owner: "rDruU1JTwpxc7dxhWmAFFKJpq3BwreFAFg",
            expiration: 5241652095,
            amount: {
              currency: "EVR",
              issuer: "rHdSF3FWTFR11zZ4dPy17Rch1Ygch3gy8p",
              value: "-2560",
            },
            nftokenID: "0008000083CD166E1806EF2076C55077AEFD418E771A516C0000099B00000000",
            index: "81B2D5752716704EA92506003F3F58E51B795BE9DADB2698471700FF8FD4B5F6",
          },
        ],
      });
    });

    it("NFTokenAcceptOfferSell", function () {
      const tx = require("../examples/responses/NFTokenAcceptOfferSell.json");
      const result: any = Models.parseNFTokenOfferChanges(tx);

      expect(result).to.eql({
        r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3: [
          {
            status: "deleted",
            owner: "r4feBcQoNLdTkpuWSLd3HWSzNRnvgqgPr3",
            amount: "0",
            flags: 1,
            nftokenID: "000B0000E79C2D0D5F8FD6425722AE21C61D731DCA80ABC90000099B00000000",
            index: "D3C21058E60B6597BCB33A7A77B5FC90959082C96057EDBB388CE365E8D3245D",
          },
        ],
      });
    });

    it("NFTokenAcceptOfferBuy", function () {
      const tx = require("../examples/responses/NFTokenAcceptOfferBuy.json");
      const result: any = Models.parseNFTokenOfferChanges(tx);

      expect(result).to.eql({
        rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw: [
          {
            status: "deleted",
            owner: "rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw",
            amount: "1",
            flags: 0,
            nftokenID: "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF16E5DA9C00000001",
            index: "AA12128D6A55784C059FC9654FCBB8904BFCB54C850B2F94046BD9BA2743A021",
          },
        ],
      });
    });
  });

  describe("parseAffectedObjects", () => {
    it("NFTokenAcceptOfferBuy multipages", function () {
      const tx = require("../examples/responses/NFTokenAcceptOfferBuy3.json");
      const result: any = Models.parseAffectedObjects(tx);

      expect(result).to.eql({
        nftokenOffers: {
          A5BE06459D1A2FA5C68A40A8245CD2B801648064D8C531A1B35FAF2C9BF79DBE: {
            index: "A5BE06459D1A2FA5C68A40A8245CD2B801648064D8C531A1B35FAF2C9BF79DBE",
            nftokenID: "00090001E9DE3F31905919768FAB16D17D15DFA911D48C16343168CA0000002F",
            flags: {
              sellToken: false,
            },
            owner: "rNDZcpmnXG3zCLKtWqYE9LNNQRZrtLtjx2",
          },
        },
        nftokens: {
          "00090001E9DE3F31905919768FAB16D17D15DFA911D48C16343168CA0000002F": {
            nftokenID: "00090001E9DE3F31905919768FAB16D17D15DFA911D48C16343168CA0000002F",
            flags: {
              burnable: true,
              onlyXRP: false,
              trustLine: false,
              transferable: true,
            },
            transferFee: 1,
            issuer: "r4K2ggLxfX8vp5vEi3sDEeAQg3PGEH84WV",
            nftokenTaxon: 0,
            sequence: 47,
          },
        },
      });
    });

    it("NFTokenCreateOfferBuy", function () {
      const tx = require("../examples/responses/NFTokenCreateOfferBuy.json");
      const result: any = Models.parseAffectedObjects(tx);

      expect(result).to.eql({
        nftokenOffers: {
          AA12128D6A55784C059FC9654FCBB8904BFCB54C850B2F94046BD9BA2743A021: {
            index: "AA12128D6A55784C059FC9654FCBB8904BFCB54C850B2F94046BD9BA2743A021",
            nftokenID: "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF16E5DA9C00000001",
            flags: {
              sellToken: false,
            },
            owner: "rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw",
          },
        },
        nftokens: {
          "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF16E5DA9C00000001": {
            nftokenID: "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF16E5DA9C00000001",
            flags: {
              burnable: true,
              onlyXRP: true,
              trustLine: false,
              transferable: true,
            },
            transferFee: 0,
            issuer: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
            nftokenTaxon: 0,
            sequence: 1,
          },
        },
      });
    });
  });
});
