import nconf from "nconf";
import * as rippleKeypairs from "ripple-keypairs";
import { expect } from "chai";
import { Client, Models } from "../../src/index";

describe("Client", () => {
  describe("mainnet", () => {
    before(async function () {
      this.timeout(15000);
      Client.setup(nconf.get("xrpl:connections:mainnet"), { loadBalancing: true, nativeCurrency: "XRP" });
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
        expect(vl.version).to.be.eql(1);
        expect(vl?.decodedManifest?.publicKey).to.be.eql(secrets.public_key);
        expect(vl.blob?.expiration).to.be.eql(1696508603);
      });
    });

    describe("createVLv2", () => {
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
        const publishBlob = {
          sequence: 2,
          // effective: 1691847573,
          expiration: 1696508603,
          validatorsPublicKeys: ["nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec"],
        };
        const result = await Client.createVLv2(master, ephemeral, [publishBlob]);

        expect(Object.keys(result)).to.have.members(["blobs-v2", "manifest", "version", "public_key"]);

        expect(result.version).to.eql(2);
        expect(result.public_key).to.eql(master.publicKey);

        const blobs_v2 = result["blobs-v2"] as any[];
        expect(blobs_v2).to.be.a("array");
        expect(blobs_v2).to.have.length(1);

        const blob_v2 = blobs_v2?.[0];
        expect(blob_v2).to.be.a("object");
        expect(Object.keys(blob_v2)).to.have.members(["blob", "signature"]);
        expect(blob_v2.blob).to.be.eql(
          "eyJzZXF1ZW5jZSI6MiwiZXhwaXJhdGlvbiI6NzQ5ODIzODAzLCJ2YWxpZGF0b3JzIjpbeyJ2YWxpZGF0aW9uX3B1YmxpY19rZXkiOiJuSEJpZEczcFpLMTF6UUQ2a3BORG9BaER4SDZXTEd1aTZaeFNiVXg3TFNxTEhzZ3pNUGVjIiwibWFuaWZlc3QiOiJKQUFBQUFGeEllMUNScW82NmRLWVk1UklBTXlwR0Nua1JIU1lvZ3padzVjNmExazBiSFdybFhNaEFrbTFsejBjOFFYV2ZKOWIxdkI3MmRMYWJ3OHdZSWQ4TXRucHNISEJFQzhwZGtZd1JBSWdRbGI2SEo1M2hzVEFmVmlkK0FPZEJWdk1GN3JhaElLTkxCSFVnbjUyekJFQ0lHTFVxRnU4YTFBQUhSSmNWb25LWUVubWhKd2JDWExuK2plN25hMVdEMS9vY0JKQUU0dmZ2ckdTbVpDMnVBVUdtTTVkSUJ0b1NnRVVleSsyVmxlRFlFc2NlOTR0eFljalI4WjdRTE5hbGlEOHcvYkQ1L2h2WVE4bWVWMVdnMWpKRk5lMENBPT0ifV19"
        );
        expect(result.manifest).to.be.a("string");

        const vl = Models.parseVL(result);
        expect(vl.error).to.be.undefined;
        expect(vl.version).to.be.eql(2);
        expect(vl?.decodedManifest?.publicKey).to.be.eql(secrets.public_key);
        expect(vl?.decodedManifest?.Sequence).to.be.eql(publishBlob.sequence);
      });

      it("should create a valid VL with effective", async function () {
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
        const publishBlob = {
          sequence: 2,
          effective: 1691847573,
          expiration: 1696508603,
          validatorsPublicKeys: ["nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec"],
        };
        const result = await Client.createVLv2(master, ephemeral, [publishBlob]);

        expect(Object.keys(result)).to.have.members(["blobs-v2", "manifest", "version", "public_key"]);

        expect(result.version).to.eql(2);
        expect(result.public_key).to.eql(master.publicKey);

        const blobs_v2 = result["blobs-v2"] as any[];
        expect(blobs_v2).to.be.a("array");
        expect(blobs_v2).to.have.length(1);

        const blob_v2 = blobs_v2?.[0];
        expect(blob_v2).to.be.a("object");
        expect(Object.keys(blob_v2)).to.have.members(["blob", "signature"]);
        expect(blob_v2.blob).to.be.eql(
          "eyJzZXF1ZW5jZSI6MiwiZWZmZWN0aXZlIjo3NDUxNjI3NzMsImV4cGlyYXRpb24iOjc0OTgyMzgwMywidmFsaWRhdG9ycyI6W3sidmFsaWRhdGlvbl9wdWJsaWNfa2V5IjoibkhCaWRHM3BaSzExelFENmtwTkRvQWhEeEg2V0xHdWk2WnhTYlV4N0xTcUxIc2d6TVBlYyIsIm1hbmlmZXN0IjoiSkFBQUFBRnhJZTFDUnFvNjZkS1lZNVJJQU15cEdDbmtSSFNZb2d6Wnc1YzZhMWswYkhXcmxYTWhBa20xbHowYzhRWFdmSjliMXZCNzJkTGFidzh3WUlkOE10bnBzSEhCRUM4cGRrWXdSQUlnUWxiNkhKNTNoc1RBZlZpZCtBT2RCVnZNRjdyYWhJS05MQkhVZ241MnpCRUNJR0xVcUZ1OGExQUFIUkpjVm9uS1lFbm1oSndiQ1hMbitqZTduYTFXRDEvb2NCSkFFNHZmdnJHU21aQzJ1QVVHbU01ZElCdG9TZ0VVZXkrMlZsZURZRXNjZTk0dHhZY2pSOFo3UUxOYWxpRDh3L2JENS9odllROG1lVjFXZzFqSkZOZTBDQT09In1dfQ=="
        );
        expect(result.manifest).to.be.a("string");

        const vl = Models.parseVL(result);
        expect(vl.error).to.be.undefined;
        expect(vl.version).to.be.eql(2);
        expect(vl?.decodedManifest?.publicKey).to.be.eql(secrets.public_key);
        expect(vl?.decodedManifest?.Sequence).to.be.eql(publishBlob.sequence);
      });

      it("should create a valid VL with effective", async function () {
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
        const publishBlob1 = {
          sequence: 2,
          effective: 1691847573,
          expiration: 1696508603,
          validatorsPublicKeys: ["nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec"],
        };
        const publishBlob2 = {
          sequence: 3,
          effective: 1696508603,
          expiration: 1723620871,
          validatorsPublicKeys: [
            "nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec",
            "nHB8QMKGt9VB4Vg71VszjBVQnDW3v3QudM4DwFaJfy96bj4Pv9fA",
          ],
        };
        const result = await Client.createVLv2(master, ephemeral, [publishBlob1, publishBlob2]);

        expect(Object.keys(result)).to.have.members(["blobs-v2", "manifest", "version", "public_key"]);

        expect(result.version).to.eql(2);
        expect(result.public_key).to.eql(master.publicKey);

        const blobs_v2 = result["blobs-v2"] as any[];
        expect(blobs_v2).to.be.a("array");
        expect(blobs_v2).to.have.length(2);

        const blob_v2_1 = blobs_v2?.[0];
        expect(blob_v2_1).to.be.a("object");
        expect(Object.keys(blob_v2_1)).to.have.members(["blob", "signature"]);
        expect(blob_v2_1.blob).to.be.eql(
          "eyJzZXF1ZW5jZSI6MiwiZWZmZWN0aXZlIjo3NDUxNjI3NzMsImV4cGlyYXRpb24iOjc0OTgyMzgwMywidmFsaWRhdG9ycyI6W3sidmFsaWRhdGlvbl9wdWJsaWNfa2V5IjoibkhCaWRHM3BaSzExelFENmtwTkRvQWhEeEg2V0xHdWk2WnhTYlV4N0xTcUxIc2d6TVBlYyIsIm1hbmlmZXN0IjoiSkFBQUFBRnhJZTFDUnFvNjZkS1lZNVJJQU15cEdDbmtSSFNZb2d6Wnc1YzZhMWswYkhXcmxYTWhBa20xbHowYzhRWFdmSjliMXZCNzJkTGFidzh3WUlkOE10bnBzSEhCRUM4cGRrWXdSQUlnUWxiNkhKNTNoc1RBZlZpZCtBT2RCVnZNRjdyYWhJS05MQkhVZ241MnpCRUNJR0xVcUZ1OGExQUFIUkpjVm9uS1lFbm1oSndiQ1hMbitqZTduYTFXRDEvb2NCSkFFNHZmdnJHU21aQzJ1QVVHbU01ZElCdG9TZ0VVZXkrMlZsZURZRXNjZTk0dHhZY2pSOFo3UUxOYWxpRDh3L2JENS9odllROG1lVjFXZzFqSkZOZTBDQT09In1dfQ=="
        );

        const blob_v2_2 = blobs_v2?.[1];
        expect(blob_v2_2).to.be.a("object");
        expect(Object.keys(blob_v2_2)).to.have.members(["blob", "signature", "manifest"]);
        expect(blob_v2_2.blob).to.be.eql(
          "eyJzZXF1ZW5jZSI6MywiZWZmZWN0aXZlIjo3NDk4MjM4MDMsImV4cGlyYXRpb24iOjc3NjkzNjA3MSwidmFsaWRhdG9ycyI6W3sidmFsaWRhdGlvbl9wdWJsaWNfa2V5IjoibkhCaWRHM3BaSzExelFENmtwTkRvQWhEeEg2V0xHdWk2WnhTYlV4N0xTcUxIc2d6TVBlYyIsIm1hbmlmZXN0IjoiSkFBQUFBRnhJZTFDUnFvNjZkS1lZNVJJQU15cEdDbmtSSFNZb2d6Wnc1YzZhMWswYkhXcmxYTWhBa20xbHowYzhRWFdmSjliMXZCNzJkTGFidzh3WUlkOE10bnBzSEhCRUM4cGRrWXdSQUlnUWxiNkhKNTNoc1RBZlZpZCtBT2RCVnZNRjdyYWhJS05MQkhVZ241MnpCRUNJR0xVcUZ1OGExQUFIUkpjVm9uS1lFbm1oSndiQ1hMbitqZTduYTFXRDEvb2NCSkFFNHZmdnJHU21aQzJ1QVVHbU01ZElCdG9TZ0VVZXkrMlZsZURZRXNjZTk0dHhZY2pSOFo3UUxOYWxpRDh3L2JENS9odllROG1lVjFXZzFqSkZOZTBDQT09In0seyJ2YWxpZGF0aW9uX3B1YmxpY19rZXkiOiJuSEI4UU1LR3Q5VkI0Vmc3MVZzempCVlFuRFczdjNRdWRNNER3RmFKZnk5NmJqNFB2OWZBIiwibWFuaWZlc3QiOiJKQUFBQUFKeEllMDRzQ2lPb2tDMHpld1lvYVlvbnJTUUIrVHJ3TjZVU0FQcmZ2RkJ4V1pBYzNNaEFwRTVGN2FPNjVKS2tTZnA2VU15bklhazhNZHVZU096bzZLWEx2UUVqbEJ3ZGtZd1JBSWdLbTJBMTFBMk00RnF6RVcrdnJvVXlUYkhTcGtqZDNlbFEvTjBzUVRodzBzQ0lCS2xYMDMza1hkYWlKNTRsN1NpQm9RbndIblNhUWZUNGJ5MDBZbmNLV3pWZHd0aWFYUm9iMjF3TG1OdmJYQVNRQXNsL1Noa1E0UkU3YXJ2VG93RDg0c09QaGl6Q1FsSDNJenF2YUM3LzUyV0w5MkZ6SDRzMk1SenNzSUJVQ3dFaDRqTkFyY3hGeS9nQStNTzI0UVExZzg9In1dfQ=="
        );
        const manifest2 = Models.parseManifest(blob_v2_2.manifest);
        expect(manifest2.error).to.be.undefined;
        expect(manifest2.publicKey).to.be.eql(secrets.public_key);
        expect(manifest2.Sequence).to.be.eql(publishBlob2.sequence);

        expect(result.manifest).to.be.a("string");

        const vl = Models.parseVL(result);
        expect(vl.error).to.be.undefined;
        expect(vl.version).to.be.eql(2);
        expect(vl?.decodedManifest?.publicKey).to.be.eql(secrets.public_key);
        expect(vl?.decodedManifest?.Sequence).to.be.eql(publishBlob1.sequence);
      });
    });
  });
});
