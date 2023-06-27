import nconf from "nconf";
import * as rippleKeypairs from "ripple-keypairs";
import { expect } from "chai";
import { Client, Models } from "../../src/index";

describe("Client", () => {
  describe("mainnet", () => {
    before(async function () {
      this.timeout(15000);
      Client.setup(nconf.get("xrpl:connections:mainnet"));
      await Client.connect();
    });

    describe("createVL", () => {
      it("should create a valid VL", async function () {
        this.timeout(15000);

        const secrets = {
          key_type: "ed25519",
          secret_key: "pncRK5E6tyFQwTXaUpXKZkSkBwuJ1EEBDcbwMBJyAVTeDZUmR7u",
          public_key: "nHUa1qqv3ih232B26LCEnS9kQ89Ab8A6jwWy5ARGztUfnej3fcBg",
          PublicKey: "ED62A2B6119230C074AD9E3F942316A1B4B0AAF00ADCDB1714609CB964BEA1EED2",
        };

        const master = { privateKey: secrets.secret_key, publicKey: secrets.PublicKey };
        const seed = rippleKeypairs.generateSeed({ algorithm: "ecdsa-secp256k1" });
        const ephemeral = rippleKeypairs.deriveKeypair(seed);
        const validators = ["nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec"];
        const result = await Client.createVL(master, ephemeral, 2, 1696508603, validators);

        expect(Object.keys(result)).to.have.members(["blob", "manifest", "signature", "version", "public_key"]);

        expect(result.version).to.eql(1);
        expect(result.public_key).to.eql(master.publicKey);
        expect(result.blob).to.be.eql(
          "eyJzZXF1ZW5jZSI6MiwiZXhwaXJhdGlvbiI6NzQ5ODIzODAzLCJ2YWxpZGF0b3JzIjpbeyJ2YWxpZGF0aW9uX3B1YmxpY19rZXkiOiJuSEJpZEczcFpLMTF6UUQ2a3BORG9BaER4SDZXTEd1aTZaeFNiVXg3TFNxTEhzZ3pNUGVjIiwibWFuaWZlc3QiOiJKQUFBQUFGeEllMUNScW82NmRLWVk1UklBTXlwR0Nua1JIU1lvZ3padzVjNmExazBiSFdybFhNaEFrbTFsejBjOFFYV2ZKOWIxdkI3MmRMYWJ3OHdZSWQ4TXRucHNISEJFQzhwZGtZd1JBSWdRbGI2SEo1M2hzVEFmVmlkK0FPZEJWdk1GN3JhaElLTkxCSFVnbjUyekJFQ0lHTFVxRnU4YTFBQUhSSmNWb25LWUVubWhKd2JDWExuK2plN25hMVdEMS9vY0JKQUU0dmZ2ckdTbVpDMnVBVUdtTTVkSUJ0b1NnRVVleSsyVmxlRFlFc2NlOTR0eFljalI4WjdRTE5hbGlEOHcvYkQ1L2h2WVE4bWVWMVdnMWpKRk5lMENBPT0ifV19"
        );
        expect(result.manifest).to.be.a("string");

        const vl = Models.parseVL(result);
        expect(vl.error).to.be.undefined;
        expect(vl?.decodedManifest?.publicKey).to.be.eql(secrets.public_key);
        expect(vl.blob?.expiration).to.be.eql(749823803);
      });
    });
  });
});
