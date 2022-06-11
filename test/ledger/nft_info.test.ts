import nconf from "nconf";
import { expect } from "chai";
import { Client } from "../../src/index";

describe("Client", () => {
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
