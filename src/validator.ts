import * as assert from "assert";
import { decodeNodePublic, encodeNodePublic } from "ripple-address-codec";
import * as Crypto from "crypto";
import * as Base58 from "./base58";
import crypto from "crypto";

const DER_PRIVATE_KEY_PREFIX = Buffer.from("302E020100300506032B657004220420", "hex");
const DER_PUBLIC_KEY_PREFIX = Buffer.from("302A300506032B6570032100", "hex");
const VALIDATOR_HEX_PUBLIC_KEY_PREFIX = "ED";
const VALIDATOR_NODE_PUBLIC_KEY_PREFIX = "n";

// xrpl_address_from_validator_pk
export function classicAddressFromValidatorPK(pk: string | Buffer): string | null {
  let pubkey = pk;
  if (typeof pk === "string") {
    pubkey = decodeNodePublic(pk);
  }

  assert.ok(pubkey.length === 33);
  assert.ok(Crypto.getHashes().includes("sha256"));
  assert.ok(Crypto.getHashes().includes("ripemd160"));

  const pubkeyInnerHash = Crypto.createHash("sha256").update(Buffer.from(pubkey));
  const pubkeyOuterHash = Crypto.createHash("ripemd160");
  pubkeyOuterHash.update(pubkeyInnerHash.digest());
  const accountID = pubkeyOuterHash.digest();
  const addressTypePrefix = Buffer.from([0x00]);
  const payload = Buffer.concat([addressTypePrefix, accountID]);
  const chksumHash1 = Crypto.createHash("sha256").update(payload).digest();
  const chksumHash2 = Crypto.createHash("sha256").update(chksumHash1).digest();
  const checksum = chksumHash2.slice(0, 4);
  const dataToEncode = Buffer.concat([payload, checksum]);
  const address = Base58.encode(dataToEncode);

  return address;
}

export interface GenerateSecretsInterface {
  key_type: string; // "ed25519"
  secret_key: string; // base58 encoded private key
  public_key: string; // node public key
  PublicKey: string; // hex public key
}

export function generateSecrets(): GenerateSecretsInterface {
  const keypair = crypto.generateKeyPairSync("ed25519", {
    privateKeyEncoding: { format: "der", type: "pkcs8" },
    publicKeyEncoding: { format: "der", type: "spki" },
  });

  const { privateKey, publicKey } = keypair;

  const PublicKey =
    VALIDATOR_HEX_PUBLIC_KEY_PREFIX +
    publicKey.slice(DER_PUBLIC_KEY_PREFIX.length, publicKey.length).toString("hex").toUpperCase();

  return {
    key_type: "ed25519",
    secret_key: Base58.encode(privateKey.slice(DER_PRIVATE_KEY_PREFIX.length, privateKey.length)) as string,
    public_key: encodeNodePublic(Buffer.from(PublicKey, "hex")),
    PublicKey,
  };
}

export function createCryptoPrivateKey(secret: string): crypto.KeyObject {
  const key = Buffer.concat([DER_PRIVATE_KEY_PREFIX, Base58.decode(secret) as Buffer]);

  return crypto.createPrivateKey({
    key: key,
    format: "der",
    type: "pkcs8",
  });
}

export function createCryptoPublicKey(publicKey: string): crypto.KeyObject {
  let publicKeyBuffer: Buffer = Buffer.alloc(0);

  // if first 2 bytes is "ED" then it is a validator hex public key
  if (publicKey.slice(0, 2) === VALIDATOR_HEX_PUBLIC_KEY_PREFIX) {
    publicKeyBuffer = Buffer.from(publicKey.slice(2), "hex");

    // if first byte is "n" then it is a node public key
  } else if (publicKey.slice(0, 1) === VALIDATOR_NODE_PUBLIC_KEY_PREFIX) {
    publicKeyBuffer = decodeNodePublic(publicKey).slice(1);
  }

  if (!publicKeyBuffer) {
    throw new Error("Invalid public key");
  }

  const key = Buffer.concat([DER_PUBLIC_KEY_PREFIX, publicKeyBuffer]);

  return crypto.createPublicKey({
    key: key,
    format: "der",
    type: "spki",
  });
}

export function sign(message: Buffer, secret: string): string {
  const key = createCryptoPrivateKey(secret);

  const signature = crypto.sign(null, message, key);

  return signature.toString("hex").toUpperCase();
}

export function verify(message: Buffer, publikKey: string, signature: string): boolean {
  const key = createCryptoPublicKey(publikKey);

  const verify = crypto.verify(null, message, key, Buffer.from(signature, "hex"));

  return verify;
}
