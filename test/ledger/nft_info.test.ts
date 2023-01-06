import nconf from "nconf";
import { expect } from "chai";
import { Client } from "../../src/index";

describe("Client", () => {
  describe("xls20", () => {
    before(async function () {
      Client.setup(nconf.get("xrpl:connections:xls20net"));
      await Client.connect();
    });

    describe("getNftInfo", () => {
      it("works for active", async function () {
        const result: any = await Client.getNftInfo("000B0000C124E14881533A9AFE4A5F481795C17003A9FACF0000099B00000000");
        expect(result).to.eql({
          nft_id: "000B0000C124E14881533A9AFE4A5F481795C17003A9FACF0000099B00000000",
          ledger_index: 75217,
          owner: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
          is_burned: false,
          flags: 11,
          transfer_fee: 0,
          issuer: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
          nft_taxon: 0,
          nft_sequence: 0,
          uri: "ipfs://QmQjDvDhfHcMyUgDAxKig4AoMTtS5JrsfpiEEpFa3F9QRt",
          validated: true,
        });
      });

      it("works for burned", async function () {
        const result: any = await Client.getNftInfo("000F0032B6AB2D2C748939F237E1B9ACB589875CB957455E78E2DBCD00000032");
        expect(result).to.eql({
          nft_id: "000F0032B6AB2D2C748939F237E1B9ACB589875CB957455E78E2DBCD00000032",
          ledger_index: 310315,
          owner: "rUoevHvHkU8H7NN7W4fMRXyz6ipM1TNxDe",
          is_burned: true,
          flags: 15,
          transfer_fee: 50,
          issuer: "rHe1sToM6nQ37FzrGdC9WWCqJKaaRLscgJ",
          nft_taxon: 0,
          nft_sequence: 50,
          validated: true,
        });
      });
    });
  });

  describe("mainnet", () => {
    before(async function () {
      Client.setup(nconf.get("xrpl:connections:mainnet"));
      await Client.connect();
    });

    describe("getNftInfo", () => {
      it("works for active", async function () {
        const result: any = await Client.getNftInfo("000A1388603AFB3F50BD754869ED1EDC825E41723ED092F570A1C03E00000048");
        expect(result).to.eql({
          nft_id: "000A1388603AFB3F50BD754869ED1EDC825E41723ED092F570A1C03E00000048",
          ledger_index: 75678544,
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
