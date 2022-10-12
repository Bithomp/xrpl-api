import { expect } from "chai";
import * as rippleKeypairs from "ripple-keypairs";
import { Validator } from "../src/index";

describe("Wallet", () => {
  describe("classicAddressFromValidatorPK", () => {
    it("works", async function () {
      const pk = "nHBtDzdRDykxiuv7uSMPTcGexNm879RUUz5GW4h1qgjbtyvWZ1LE";
      const address = "rHiJahydBswnAUMZk5yhTjTvcjBE1fXAGh";

      expect(Validator.classicAddressFromValidatorPK(pk)).to.eql(address);
    });
  });

  describe("generateSecrets", () => {
    it("works", async function () {
      const secrets = Validator.generateSecrets();

      expect(secrets.key_type).to.eql("ed25519");
      expect(secrets.secret_key).to.be.a("string");
      expect(secrets.public_key).to.be.a("string");
    });
  });

  describe("sign", () => {
    it("works", function () {
      const secrets = Validator.generateSecrets();
      const message = "hello world";
      const signature = Validator.sign(Buffer.from(message, "ascii"), secrets.secret_key);

      expect(signature).to.be.a("string");

      const verify = Validator.verify(Buffer.from(message, "ascii"), signature, secrets.public_key);
      expect(verify).to.eql(true);
    });

    it("works with text", function () {
      const secrets = Validator.generateSecrets();
      const message = "hello world";
      const signature = Validator.sign(message, secrets.secret_key);

      expect(signature).to.be.a("string");

      const verify = Validator.verify(message, signature, secrets.public_key);
      expect(verify).to.eql(true);
    });

    it("works with text", function () {
      const secrets = {
        key_type: "ed25519",
        public_key: "nHUz2S2qRS7VRAyyMV7pxS6Pdgq1sdpwXyuTdTqF2orYwPn6Ju3A",
        secret_key: "paBfSwcno3HSGYU3KU1LrUHx4mEnC8QbUdT9d9TSNb8jKNo8WDi",
      };
      const message = "hello world";
      const signature = Validator.sign(message, secrets.secret_key);

      expect(signature).to.be.a("string");

      const verify = Validator.verify(message, signature, secrets.public_key);
      expect(verify).to.eql(true);
    });

    it("works with secp256k1 and hex encoded", function () {
      const seed = rippleKeypairs.generateSeed({ algorithm: "ecdsa-secp256k1" });
      const keypair = rippleKeypairs.deriveKeypair(seed);

      const message = "hello world";
      const signature = Validator.sign(Buffer.from(message, "ascii"), keypair.privateKey);

      expect(signature).to.be.a("string");

      const verify = Validator.verify(Buffer.from(message, "ascii"), signature, keypair.publicKey);
      expect(verify).to.eql(true);
    });
  });

  describe("verify", () => {
    it("works", function () {
      const secrets = Validator.generateSecrets();
      const message = "hello world";
      const signature = Validator.sign(Buffer.from(message, "ascii"), secrets.secret_key);

      expect(signature).to.be.a("string");

      const verify = Validator.verify(Buffer.from(message, "ascii"), signature, secrets.public_key);
      expect(verify).to.eql(true);

      const verify2 = Validator.verify2(Buffer.from(message, "ascii"), signature, secrets.public_key);
      expect(verify2).to.eql(true);
    });

    it("validates ed25519 from mainet", function () {
      const vl = require("./examples/vl/valid.json");

      const result = Validator.verify(
        Buffer.from(vl.blob, "base64"),
        vl.signature,
        "ED18825E25019852216546D97C71C609FB42B5CB0F792534D5CC00B7486486CD14" // SigningPubKey
      );

      expect(result).to.be.true;
    });

    it("validates secp256k1", function () {
      const vl = require("./examples/vl/valid_with_signpub_key.json");
      const result = Validator.verify(
        Buffer.from(vl.blob, "base64"),
        vl.signature,
        "03553F67DC5A6FE0EBFE1B3B4742833D14AF7C65E79E5760EC76EC56EAFD254CE9" // SigningPubKey
      );
      expect(result).to.be.true;
    });
  });
});
