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

      const verify = Validator.verify(Buffer.from(message, "ascii"), secrets.public_key, signature);
      expect(verify).to.eql(true);
    });

    it("works with text", function () {
      const secrets = Validator.generateSecrets();
      const message = "hello world";
      const signature = Validator.sign(message, secrets.secret_key);

      expect(signature).to.be.a("string");

      const verify = Validator.verify(message, secrets.public_key, signature);
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

      const verify = Validator.verify(message, secrets.public_key, signature);
      expect(verify).to.eql(true);
    });

    it("works with secp256k1 and hex encoded", function () {
      const seed = rippleKeypairs.generateSeed({ algorithm: "ecdsa-secp256k1" });
      const keypair = rippleKeypairs.deriveKeypair(seed);

      const message = "hello world";
      const signature = Validator.sign(Buffer.from(message, "ascii"), keypair.privateKey);

      expect(signature).to.be.a("string");

      const verify = Validator.verify(Buffer.from(message, "ascii"), keypair.publicKey, signature);
      expect(verify).to.eql(true);
    });
  });

  describe("verify", () => {
    it("works", function () {
      const secrets = Validator.generateSecrets();
      const message = "hello world";
      const signature = Validator.sign(Buffer.from(message, "ascii"), secrets.secret_key);

      expect(signature).to.be.a("string");

      const verify = Validator.verify(Buffer.from(message, "ascii"), secrets.public_key, signature);
      expect(verify).to.eql(true);
    });
  });
});
