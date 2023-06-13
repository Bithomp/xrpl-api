import nconf from "nconf";
import { expect } from "chai";
import { Client } from "../../src/index";

describe("Client", () => {
  describe("mainnet", () => {
    before(async function () {
      this.timeout(10000);
      Client.setup(nconf.get("xrpl:connections:mainnet"));
      await Client.connect();
    });

    describe("getNftInfo", () => {
      it("works for active", async function () {
        const result: any = await Client.getNftInfo("000A1388603AFB3F50BD754869ED1EDC825E41723ED092F570A1C03E00000048");
        expect(result).to.eql({
          nft_id: "000A1388603AFB3F50BD754869ED1EDC825E41723ED092F570A1C03E00000048",
          ledger_index: 77599673,
          owner: "raNf8ibQZECTaiFqkDXKRmM2GfdWK76cSu",
          is_burned: false,
          flags: 10,
          transfer_fee: 5000,
          issuer: "r9mFXXpQY1wNbpv6SJuuPTQSVgTyrEiBrh",
          nft_taxon: 201181,
          nft_serial: 72,
          uri: "68747470733A2F2F697066732E696F2F697066732F6261667962656962677A737678677774657763356278717A72626E6E797A75657A3736676375626F3637796D676265746E7A6B68356237743236752F6D657461646174612E6A736F6E",
          validated: true,
        });
      });

      it("works for burned", async function () {
        const result: any = await Client.getNftInfo("00081388EA3205EBC53FFE1C0B07907754CA8FDEE54306700000099B00000000");
        expect(result).to.eql({
          nft_id: "00081388EA3205EBC53FFE1C0B07907754CA8FDEE54306700000099B00000000",
          ledger_index: 75446233,
          owner: "r4MKsZGUM8YvTyX2cLDwDujhh2UzdNnNTC",
          is_burned: true,
          flags: 8,
          transfer_fee: 5000,
          issuer: "r4MKsZGUM8YvTyX2cLDwDujhh2UzdNnNTC",
          nft_taxon: 0,
          nft_serial: 0,
          uri: "68747470733A2F2F62616679626569656E7662786B756F6C6B3778336333366177686A34346E6F6F687776613370683568376B746A78616D686D6F63333265733632712E697066732E6E667473746F726167652E6C696E6B2F616C6D69676874795F626972642E6A7067",
          validated: true,
        });
      });
    });
  });
});
