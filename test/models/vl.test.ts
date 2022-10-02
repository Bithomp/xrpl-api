import { expect } from "chai";
import { Models } from "../../src/index";

describe("Models", () => {
  describe("parseVL", () => {
    it("parses not valid", function () {
      const notValid = require("../examples/vl/not_valid.json");
      const expected = require("../examples/vl/decoded_not_valid.json");

      const result = Models.parseVL(notValid);
      expect(JSON.stringify(result)).to.be.eql(JSON.stringify(expected));
    });

    it("parses valid", function () {
      const valid = require("../examples/vl/valid.json");
      const expected = require("../examples/vl/decoded_valid.json");

      const result = Models.parseVL(valid);
      expect(JSON.stringify(result)).to.be.eql(JSON.stringify(expected));
    });
  });

  describe("isValidVL", () => {
    it("validates valid", function () {
      const valid = require("../examples/vl/valid.json");
      const result = Models.isValidVL(valid);
      expect(result).to.be.null;
    });

    it("validates not valid", function () {
      const notValid = require("../examples/vl/not_valid.json");
      const result = Models.isValidVL(notValid);

      console.log(result);
      expect(result).to.be.eq("Master signature does not match");
    });
  });

  describe("parseValidationData", () => {
    it("returns decoded data", function () {
      const result = Models.parseValidationData(
        "228000000126046F0B01292AB47C7A3A8B0D3B6F775C823E5148E2C637974E505E81356D178EBE80834B633AC426B29CAB5DB42A9C073FF99B50177B68F88701CD73D951976540DFF5CAA2A00F6B605F1BCE82DC1B5D83DE1CBCDF5019E56337278151F76351C8251392FD2089C9714B92A3BC38A0CF720D7B02F69E517321033CE387D979DAEAF4A7D67F0A76C84B2A09C3859558A1DAE886663D3F0121A9D77646304402202A20BDBFA3C2BC376A46ED7A3A245F8D19D1DABE96888D84429B6F732525E46D022027F9DAA466A63E44938BC074289804EB5B68BC3F1F99988E384213526476143C",
        "033CE387D979DAEAF4A7D67F0A76C84B2A09C3859558A1DAE886663D3F0121A9D7"
      );

      expect(result).to.be.eql({
        Flags: 2147483649,
        LedgerSequence: 74386177,
        SigningTime: 716471418,
        Cookie: "10019730095899181630",
        LedgerHash: "48E2C637974E505E81356D178EBE80834B633AC426B29CAB5DB42A9C073FF99B",
        ConsensusHash: "7B68F88701CD73D951976540DFF5CAA2A00F6B605F1BCE82DC1B5D83DE1CBCDF",
        ValidatedHash: "E56337278151F76351C8251392FD2089C9714B92A3BC38A0CF720D7B02F69E51",
        SigningPubKey: "033CE387D979DAEAF4A7D67F0A76C84B2A09C3859558A1DAE886663D3F0121A9D7",
        Signature:
          "304402202A20BDBFA3C2BC376A46ED7A3A245F8D19D1DABE96888D84429B6F732525E46D022027F9DAA466A63E44938BC074289804EB5B68BC3F1F99988E384213526476143C",
        _verified: true,
      });
    });
  });
});
