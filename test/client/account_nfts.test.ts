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
          Flags: 11,
          Issuer: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
          TokenID: "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF0000099B00000000",
          TokenTaxon: 0,
          URI: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
          nft_serial: 0,
        },
        {
          Flags: 11,
          Issuer: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
          TokenID: "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF2DCBAB9D00000002",
          TokenTaxon: 0,
          URI: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
          nft_serial: 2,
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
      const offer = "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF0000099B00000000";
      const result: any = await Client.getAccountNftSellOffers(offer);
      expect(result[0]).to.eql({
        amount: "1000000000000000",
        flags: 1,
        index: "0FEDCDB1A329C80B5BF75F3EC3D7634A03B9CCC41B34E67E36C951BA08065D31",
        owner: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
      });
    });
  });

  describe("getAccountNftBuyOffers", () => {
    it("works", async function () {
      const offer = "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF16E5DA9C00000001";
      const result: any = await Client.getAccountNftBuyOffers(offer);
      expect(result[0]).to.eql({
        amount: "1",
        flags: 0,
        index: "F5BC0A6FD7DFA22A92CD44DE7F548760D855C35755857D1AAFD41CA3CA57CA3A",
        owner: "rM3UEiJzg7nMorRhdED5savWDt1Gqb6TLw",
      });
    });
  });
});
