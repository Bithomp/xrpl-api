import nconf from "nconf";
import * as rippleKeypairs from "ripple-keypairs";
import { expect } from "chai";
import { Client, Models, Validator } from "../../src/index";

describe("Client", () => {
  describe("mainnet", () => {
    before(async function () {
      this.timeout(15000);
      Client.setup(nconf.get("xrpl:connections:mainnet"), { loadBalancing: true, nativeCurrency: "XRP" });
      await Client.connect();
    });

    describe("createVL", () => {
      it("should create a valid VL with ripple-keypairs", async function () {
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
          "eyJzZXF1ZW5jZSI6MiwiZXhwaXJhdGlvbiI6NzQ5ODIzODAzLCJ2YWxpZGF0b3JzIjpbeyJ2YWxpZGF0aW9uX3B1YmxpY19rZXkiOiJFRDQyNDZBQTNBRTlEMjk4NjM5NDQ4MDBDQ0E5MTgyOUU0NDQ3NDk4QTIwQ0Q5QzM5NzNBNkI1OTM0NkM3NUFCOTUiLCJtYW5pZmVzdCI6IkpBQUFBQUZ4SWUxQ1JxbzY2ZEtZWTVSSUFNeXBHQ25rUkhTWW9nelp3NWM2YTFrMGJIV3JsWE1oQWttMWx6MGM4UVhXZko5YjF2QjcyZExhYnc4d1lJZDhNdG5wc0hIQkVDOHBka1l3UkFJZ1FsYjZISjUzaHNUQWZWaWQrQU9kQlZ2TUY3cmFoSUtOTEJIVWduNTJ6QkVDSUdMVXFGdThhMUFBSFJKY1ZvbktZRW5taEp3YkNYTG4ramU3bmExV0QxL29jQkpBRTR2ZnZyR1NtWkMydUFVR21NNWRJQnRvU2dFVWV5KzJWbGVEWUVzY2U5NHR4WWNqUjhaN1FMTmFsaUQ4dy9iRDUvaHZZUThtZVYxV2cxakpGTmUwQ0E9PSJ9XX0="
        );
        expect(result.manifest).to.be.a("string");

        const vl = Models.parseVL(result);
        expect(vl.error).to.be.undefined;
        expect(vl.version).to.be.eql(1);
        expect(vl?.decodedManifest?.publicKey).to.be.eql(secrets.public_key);
        expect(vl.blob?.expiration).to.be.eql(1696508603);
      });

      it("should create a valid VL with generateSecrets", async function () {
        this.timeout(15000);

        const masterSecrets = {
          key_type: "ed25519",
          secret_key: "pncRK5E6tyFQwTXaUpXKZkSkBwuJ1EEBDcbwMBJyAVTeDZUmR7u",
          public_key: "nHUa1qqv3ih232B26LCEnS9kQ89Ab8A6jwWy5ARGztUfnej3fcBg",
          PublicKey: "ED62A2B6119230C074AD9E3F942316A1B4B0AAF00ADCDB1714609CB964BEA1EED2",
        };

        const master = { privateKey: masterSecrets.secret_key, publicKey: masterSecrets.PublicKey };
        const ephemeralSecrets = Validator.generateSecrets();
        const ephemeral = { privateKey: ephemeralSecrets.secret_key, publicKey: ephemeralSecrets.PublicKey };
        const validators = ["nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec"];
        const result = await Client.createVL(master, ephemeral, 2, 1696508603, validators);

        expect(Object.keys(result)).to.have.members(["blob", "manifest", "signature", "version", "public_key"]);

        expect(result.version).to.eql(1);
        expect(result.public_key).to.eql(master.publicKey);
        expect(result.blob).to.be.eql(
          "eyJzZXF1ZW5jZSI6MiwiZXhwaXJhdGlvbiI6NzQ5ODIzODAzLCJ2YWxpZGF0b3JzIjpbeyJ2YWxpZGF0aW9uX3B1YmxpY19rZXkiOiJFRDQyNDZBQTNBRTlEMjk4NjM5NDQ4MDBDQ0E5MTgyOUU0NDQ3NDk4QTIwQ0Q5QzM5NzNBNkI1OTM0NkM3NUFCOTUiLCJtYW5pZmVzdCI6IkpBQUFBQUZ4SWUxQ1JxbzY2ZEtZWTVSSUFNeXBHQ25rUkhTWW9nelp3NWM2YTFrMGJIV3JsWE1oQWttMWx6MGM4UVhXZko5YjF2QjcyZExhYnc4d1lJZDhNdG5wc0hIQkVDOHBka1l3UkFJZ1FsYjZISjUzaHNUQWZWaWQrQU9kQlZ2TUY3cmFoSUtOTEJIVWduNTJ6QkVDSUdMVXFGdThhMUFBSFJKY1ZvbktZRW5taEp3YkNYTG4ramU3bmExV0QxL29jQkpBRTR2ZnZyR1NtWkMydUFVR21NNWRJQnRvU2dFVWV5KzJWbGVEWUVzY2U5NHR4WWNqUjhaN1FMTmFsaUQ4dy9iRDUvaHZZUThtZVYxV2cxakpGTmUwQ0E9PSJ9XX0="
        );
        expect(result.manifest).to.be.a("string");

        const vl = Models.parseVL(result);
        expect(vl.error).to.be.undefined;
        expect(vl.version).to.be.eql(1);
        expect(vl?.decodedManifest?.publicKey).to.be.eql(masterSecrets.public_key);
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

        expect(Object.keys(result)).to.have.members(["blobs_v2", "manifest", "version", "public_key"]);

        expect(result.version).to.eql(2);
        expect(result.public_key).to.eql(master.publicKey);

        const blobs_v2 = result["blobs_v2"] as any[];
        expect(blobs_v2).to.be.a("array");
        expect(blobs_v2).to.have.length(1);

        const blob_v2 = blobs_v2?.[0];
        expect(blob_v2).to.be.a("object");
        expect(Object.keys(blob_v2)).to.have.members(["blob", "signature"]);
        expect(blob_v2.blob).to.be.eql(
          "eyJzZXF1ZW5jZSI6MiwiZXhwaXJhdGlvbiI6NzQ5ODIzODAzLCJ2YWxpZGF0b3JzIjpbeyJ2YWxpZGF0aW9uX3B1YmxpY19rZXkiOiJFRDQyNDZBQTNBRTlEMjk4NjM5NDQ4MDBDQ0E5MTgyOUU0NDQ3NDk4QTIwQ0Q5QzM5NzNBNkI1OTM0NkM3NUFCOTUiLCJtYW5pZmVzdCI6IkpBQUFBQUZ4SWUxQ1JxbzY2ZEtZWTVSSUFNeXBHQ25rUkhTWW9nelp3NWM2YTFrMGJIV3JsWE1oQWttMWx6MGM4UVhXZko5YjF2QjcyZExhYnc4d1lJZDhNdG5wc0hIQkVDOHBka1l3UkFJZ1FsYjZISjUzaHNUQWZWaWQrQU9kQlZ2TUY3cmFoSUtOTEJIVWduNTJ6QkVDSUdMVXFGdThhMUFBSFJKY1ZvbktZRW5taEp3YkNYTG4ramU3bmExV0QxL29jQkpBRTR2ZnZyR1NtWkMydUFVR21NNWRJQnRvU2dFVWV5KzJWbGVEWUVzY2U5NHR4WWNqUjhaN1FMTmFsaUQ4dy9iRDUvaHZZUThtZVYxV2cxakpGTmUwQ0E9PSJ9XX0="
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

        expect(Object.keys(result)).to.have.members(["blobs_v2", "manifest", "version", "public_key"]);

        expect(result.version).to.eql(2);
        expect(result.public_key).to.eql(master.publicKey);

        const blobs_v2 = result["blobs_v2"] as any[];
        expect(blobs_v2).to.be.a("array");
        expect(blobs_v2).to.have.length(1);

        const blob_v2 = blobs_v2?.[0];
        expect(blob_v2).to.be.a("object");
        expect(Object.keys(blob_v2)).to.have.members(["blob", "signature"]);
        expect(blob_v2.blob).to.be.eql(
          "eyJzZXF1ZW5jZSI6MiwiZWZmZWN0aXZlIjo3NDUxNjI3NzMsImV4cGlyYXRpb24iOjc0OTgyMzgwMywidmFsaWRhdG9ycyI6W3sidmFsaWRhdGlvbl9wdWJsaWNfa2V5IjoiRUQ0MjQ2QUEzQUU5RDI5ODYzOTQ0ODAwQ0NBOTE4MjlFNDQ0NzQ5OEEyMENEOUMzOTczQTZCNTkzNDZDNzVBQjk1IiwibWFuaWZlc3QiOiJKQUFBQUFGeEllMUNScW82NmRLWVk1UklBTXlwR0Nua1JIU1lvZ3padzVjNmExazBiSFdybFhNaEFrbTFsejBjOFFYV2ZKOWIxdkI3MmRMYWJ3OHdZSWQ4TXRucHNISEJFQzhwZGtZd1JBSWdRbGI2SEo1M2hzVEFmVmlkK0FPZEJWdk1GN3JhaElLTkxCSFVnbjUyekJFQ0lHTFVxRnU4YTFBQUhSSmNWb25LWUVubWhKd2JDWExuK2plN25hMVdEMS9vY0JKQUU0dmZ2ckdTbVpDMnVBVUdtTTVkSUJ0b1NnRVVleSsyVmxlRFlFc2NlOTR0eFljalI4WjdRTE5hbGlEOHcvYkQ1L2h2WVE4bWVWMVdnMWpKRk5lMENBPT0ifV19"
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

        expect(Object.keys(result)).to.have.members(["blobs_v2", "manifest", "version", "public_key"]);

        expect(result.version).to.eql(2);
        expect(result.public_key).to.eql(master.publicKey);

        const blobs_v2 = result["blobs_v2"] as any[];
        expect(blobs_v2).to.be.a("array");
        expect(blobs_v2).to.have.length(2);

        const blob_v2_1 = blobs_v2?.[0];
        expect(blob_v2_1).to.be.a("object");
        expect(Object.keys(blob_v2_1)).to.have.members(["blob", "signature"]);
        expect(blob_v2_1.blob).to.be.eql(
          "eyJzZXF1ZW5jZSI6MiwiZWZmZWN0aXZlIjo3NDUxNjI3NzMsImV4cGlyYXRpb24iOjc0OTgyMzgwMywidmFsaWRhdG9ycyI6W3sidmFsaWRhdGlvbl9wdWJsaWNfa2V5IjoiRUQ0MjQ2QUEzQUU5RDI5ODYzOTQ0ODAwQ0NBOTE4MjlFNDQ0NzQ5OEEyMENEOUMzOTczQTZCNTkzNDZDNzVBQjk1IiwibWFuaWZlc3QiOiJKQUFBQUFGeEllMUNScW82NmRLWVk1UklBTXlwR0Nua1JIU1lvZ3padzVjNmExazBiSFdybFhNaEFrbTFsejBjOFFYV2ZKOWIxdkI3MmRMYWJ3OHdZSWQ4TXRucHNISEJFQzhwZGtZd1JBSWdRbGI2SEo1M2hzVEFmVmlkK0FPZEJWdk1GN3JhaElLTkxCSFVnbjUyekJFQ0lHTFVxRnU4YTFBQUhSSmNWb25LWUVubWhKd2JDWExuK2plN25hMVdEMS9vY0JKQUU0dmZ2ckdTbVpDMnVBVUdtTTVkSUJ0b1NnRVVleSsyVmxlRFlFc2NlOTR0eFljalI4WjdRTE5hbGlEOHcvYkQ1L2h2WVE4bWVWMVdnMWpKRk5lMENBPT0ifV19"
        );

        const blob_v2_2 = blobs_v2?.[1];
        expect(blob_v2_2).to.be.a("object");
        expect(Object.keys(blob_v2_2)).to.have.members(["blob", "signature", "manifest"]);
        expect(blob_v2_2.blob).to.be.eql(
          "eyJzZXF1ZW5jZSI6MywiZWZmZWN0aXZlIjo3NDk4MjM4MDMsImV4cGlyYXRpb24iOjc3NjkzNjA3MSwidmFsaWRhdG9ycyI6W3sidmFsaWRhdGlvbl9wdWJsaWNfa2V5IjoiRUQ0MjQ2QUEzQUU5RDI5ODYzOTQ0ODAwQ0NBOTE4MjlFNDQ0NzQ5OEEyMENEOUMzOTczQTZCNTkzNDZDNzVBQjk1IiwibWFuaWZlc3QiOiJKQUFBQUFGeEllMUNScW82NmRLWVk1UklBTXlwR0Nua1JIU1lvZ3padzVjNmExazBiSFdybFhNaEFrbTFsejBjOFFYV2ZKOWIxdkI3MmRMYWJ3OHdZSWQ4TXRucHNISEJFQzhwZGtZd1JBSWdRbGI2SEo1M2hzVEFmVmlkK0FPZEJWdk1GN3JhaElLTkxCSFVnbjUyekJFQ0lHTFVxRnU4YTFBQUhSSmNWb25LWUVubWhKd2JDWExuK2plN25hMVdEMS9vY0JKQUU0dmZ2ckdTbVpDMnVBVUdtTTVkSUJ0b1NnRVVleSsyVmxlRFlFc2NlOTR0eFljalI4WjdRTE5hbGlEOHcvYkQ1L2h2WVE4bWVWMVdnMWpKRk5lMENBPT0ifSx7InZhbGlkYXRpb25fcHVibGljX2tleSI6IkVEMzhCMDI4OEVBMjQwQjRDREVDMThBMUE2Mjg5RUI0OTAwN0U0RUJDMERFOTQ0ODAzRUI3RUYxNDFDNTY2NDA3MyIsIm1hbmlmZXN0IjoiSkFBQUFBSnhJZTA0c0NpT29rQzB6ZXdZb2FZb25yU1FCK1Ryd042VVNBUHJmdkZCeFdaQWMzTWhBcEU1RjdhTzY1SktrU2ZwNlVNeW5JYWs4TWR1WVNPem82S1hMdlFFamxCd2RrWXdSQUlnS20yQTExQTJNNEZxekVXK3Zyb1V5VGJIU3BramQzZWxRL04wc1FUaHcwc0NJQktsWDAzM2tYZGFpSjU0bDdTaUJvUW53SG5TYVFmVDRieTAwWW5jS1d6VmR3dGlhWFJvYjIxd0xtTnZiWEFTUUFzbC9TaGtRNFJFN2FydlRvd0Q4NHNPUGhpekNRbEgzSXpxdmFDNy81MldMOTJGekg0czJNUnpzc0lCVUN3RWg0ak5BcmN4RnkvZ0ErTU8yNFFRMWc4PSJ9XX0="
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
