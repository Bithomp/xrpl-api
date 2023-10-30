import nconf from "nconf";
import { expect } from "chai";
import { Client } from "../../src/index";

describe("Client", () => {
  describe("testnet", () => {
    before(async function () {
      Client.setup(nconf.get("xrpl:connections:testnet"), { nativeCurrency: "XRP" });
      await Client.connect();
    });

    describe("getAccountNfts", () => {
      it("works", async function () {
        const result: any = await Client.getAccountNfts("r4zmMHH32XVDhGo8V2dFPZRJexKZc9YDUh");
        expect(result.account_nfts).to.eql([
          {
            Flags: 11,
            Issuer: "r4zmMHH32XVDhGo8V2dFPZRJexKZc9YDUh",
            NFTokenID: "000B0000F1475F5D5FFB1E867825D2C11C78CBDCC4EF67650000099B00000000",
            NFTokenTaxon: 0,
            URI: "626974686F6D7024746573742E626974686F6D702E636F6D",
            nft_serial: 0,
          },
          {
            Flags: 11,
            Issuer: "r4zmMHH32XVDhGo8V2dFPZRJexKZc9YDUh",
            NFTokenID: "000B0000F1475F5D5FFB1E867825D2C11C78CBDCC4EF676544B17C9E00000003",
            NFTokenTaxon: 0,
            URI: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
            nft_serial: 3,
          },
          {
            Flags: 0,
            Issuer: "rN6tv3mZtnvjfDWdyvR47uwP4uEi2HuVKM",
            NFTokenID: "0000000096559C6D26437B219661DD6AA2F68558B1A17BD30000099B00000000",
            NFTokenTaxon: 0,
            URI: "626974686F6D7024746573742E626974686F6D702E636F6D",
            nft_serial: 0,
          },
        ]);
      });
    });

    describe("findAccountNfts", () => {
      it("works", async function () {
        const result: any = await Client.findAccountNfts("r4zmMHH32XVDhGo8V2dFPZRJexKZc9YDUh", { limit: 200 });
        expect(result.account_nfts).to.eql([
          {
            Flags: 11,
            Issuer: "r4zmMHH32XVDhGo8V2dFPZRJexKZc9YDUh",
            NFTokenID: "000B0000F1475F5D5FFB1E867825D2C11C78CBDCC4EF67650000099B00000000",
            NFTokenTaxon: 0,
            URI: "626974686F6D7024746573742E626974686F6D702E636F6D",
            nft_serial: 0,
          },
          {
            Flags: 11,
            Issuer: "r4zmMHH32XVDhGo8V2dFPZRJexKZc9YDUh",
            NFTokenID: "000B0000F1475F5D5FFB1E867825D2C11C78CBDCC4EF676544B17C9E00000003",
            NFTokenTaxon: 0,
            URI: "697066733A2F2F516D516A447644686648634D7955674441784B696734416F4D547453354A72736670694545704661334639515274",
            nft_serial: 3,
          },
          {
            Flags: 0,
            Issuer: "rN6tv3mZtnvjfDWdyvR47uwP4uEi2HuVKM",
            NFTokenID: "0000000096559C6D26437B219661DD6AA2F68558B1A17BD30000099B00000000",
            NFTokenTaxon: 0,
            URI: "626974686F6D7024746573742E626974686F6D702E636F6D",
            nft_serial: 0,
          },
        ]);
      });
    });

    describe("getAccountNftSellOffers", () => {
      it("works", async function () {
        const nftokenID = "000B0000F1475F5D5FFB1E867825D2C11C78CBDCC4EF67650000099B00000000";
        const result: any = await Client.getAccountNftSellOffers(nftokenID);
        expect(result.offers[0]).to.eql({
          amount: "4000000",
          destination: "rN6tv3mZtnvjfDWdyvR47uwP4uEi2HuVKM",
          flags: 1,
          nft_offer_index: "82962760B13C541370C2B9A2CE0F09AE65117C53CBB9ADB0FB168273253C5A14",
          owner: "r4zmMHH32XVDhGo8V2dFPZRJexKZc9YDUh",
        });
      });
    });

    describe("getAccountNftBuyOffers", () => {
      it("works", async function () {
        const nftokenID = "000B0000F1475F5D5FFB1E867825D2C11C78CBDCC4EF67650000099B00000000";
        const result: any = await Client.getAccountNftBuyOffers(nftokenID);
        expect(result.offers[0]).to.eql({
          amount: "3000000",
          flags: 0,
          nft_offer_index: "3A3EEF42653BBA9D0756C5A5CEB10E74A95531903661284404914E414E980EE0",
          owner: "rN6tv3mZtnvjfDWdyvR47uwP4uEi2HuVKM",
        });
      });
    });
  });
});
