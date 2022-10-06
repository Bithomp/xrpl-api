import { expect } from "chai";
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

  describe("createCryptoPrivateKey", () => {
    it("works", async function () {
      const secrets = Validator.generateSecrets();
      const key = Validator.createCryptoPrivateKey(secrets.secret_key);

      expect(key.type).to.eql("private");
      expect(key.asymmetricKeyType).to.eql("ed25519");
    });
  });

  describe("createCryptoPublicKey", () => {
    it("works with node public key", async function () {
      const secrets = Validator.generateSecrets();
      const key = Validator.createCryptoPublicKey(secrets.public_key);

      expect(key.type).to.eql("public");
      expect(key.asymmetricKeyType).to.eql("ed25519");
    });

    it("works with hex public key", async function () {
      const secrets = Validator.generateSecrets();
      const key = Validator.createCryptoPublicKey(secrets.PublicKey);

      expect(key.type).to.eql("public");
      expect(key.asymmetricKeyType).to.eql("ed25519");
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
