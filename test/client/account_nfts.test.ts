import nconf from "nconf";
import { expect } from "chai";
import { Client } from "../../src/index";

describe("Client", () => {
  before(async function () {
    Client.setup(nconf.get("xrpl:connections:xls20net"));
    await Client.connect();
  });

  describe("getAccountNfts", () => {
    it("works", async function () {
      const result: any = await Client.getAccountNfts("rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz");
      expect(result).to.eql([
        {
          Flags: 0,
          Issuer: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
          TokenID: "00000000C124E14881533A9AFE4A5F481795C17003A9FACF0000099B00000000",
          TokenTaxon: 0,
          URI: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
          nft_serial: 0,
        },
        {
          Flags: 0,
          Issuer: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
          TokenID: "00000000C124E14881533A9AFE4A5F481795C17003A9FACF16E5DA9C00000001",
          TokenTaxon: 0,
          URI: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
          nft_serial: 1,
        },
        {
          Flags: 0,
          Issuer: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
          TokenID: "00000000C124E14881533A9AFE4A5F481795C17003A9FACF2DCBAB9D00000002",
          TokenTaxon: 0,
          URI: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
          nft_serial: 2,
        },
        {
          Flags: 11,
          Issuer: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
          TokenID: "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF44B17C9E00000003",
          TokenTaxon: 0,
          URI: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
          nft_serial: 3,
        },
        {
          Flags: 11,
          Issuer: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
          TokenID: "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF5B974D9F00000004",
          TokenTaxon: 0,
          URI: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
          nft_serial: 4,
        },
        {
          Flags: 0,
          Issuer: "rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw",
          TokenID: "00000000DCBED2CF425AFDA5095FDD3633E5E89DE0D485D80000099B00000000",
          TokenTaxon: 0,
          URI: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
          nft_serial: 0,
        },
      ]);
    });
  });

  describe("getAccountNftSellOffers", () => {
    it("works", async function () {
      this.timeout(15000);
      const result: any = await Client.getAccountNftSellOffers(
        "00000000C124E14881533A9AFE4A5F481795C17003A9FACF0000099B00000000"
      );
      expect(result[0]).to.eql({
        amount: "1000000000000000",
        flags: 1,
        index: "3DFFC770B9476548FDA235FBEF7A2E9DE3FA6A0B19C3A689B347D2411F4CA981",
        owner: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
      });
    });
  });

  describe("getAccountNftBuyOffers", () => {
    it("works", async function () {
      this.timeout(15000);
      const result: any = await Client.getAccountNftBuyOffers(
        "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF44B17C9E00000003"
      );
      expect(result[0]).to.eql({
        amount: "1000000",
        flags: 0,
        index: "18D7B7B33A566997638B6C7A58266DB647C669C0B28655B42702A4B5A967316A",
        owner: "rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw",
      });
    });
  });
});
