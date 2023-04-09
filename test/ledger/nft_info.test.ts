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
          nft_sequence: 72,
          uri: "https://ipfs.io/ipfs/bafybeibgzsvxgwtewc5bxqzrbnnyzuez76gcubo67ymgbetnzkh5b7t26u/metadata.json",
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
          nft_sequence: 0,
          validated: true,
        });
      });
    });
  });
});
