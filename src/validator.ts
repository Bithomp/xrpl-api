import * as assert from "assert";
import { decodeNodePublic, encodeNodePublic, codec } from "ripple-address-codec";
import * as Crypto from "crypto";
import * as Base58 from "./base58";
import crypto from "crypto";
import * as rippleKeypairs from "ripple-keypairs";

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

  const secretKey = codec.encode(privateKey.slice(DER_PRIVATE_KEY_PREFIX.length, privateKey.length), {
    versions: [0x20],
    expectedLength: 32,
  });

  return {
    key_type: "ed25519",
    secret_key: secretKey,
    public_key: encodeNodePublic(Buffer.from(PublicKey, "hex")),
    PublicKey,
  };
}

export function sign(message: Buffer | string, secret: string): string {
  if (typeof message === "string") {
    message = Buffer.from(message, "utf8");
  }

  try {
    const decoded = codec.decode(secret, { versions: [0x20] });
    secret = VALIDATOR_HEX_PUBLIC_KEY_PREFIX + decoded.bytes.toString("hex");
  } catch (err) {
    // ignore
  }

  return rippleKeypairs.sign(message.toString("hex"), secret).toUpperCase();
}

export function verify(message: Buffer | string, signature: string, publicKey: string): boolean {
  if (typeof message === "string") {
    message = Buffer.from(message, "utf8");
  }

  // assume node public address as ed25519 key
  if (publicKey.slice(0, 1) === VALIDATOR_NODE_PUBLIC_KEY_PREFIX) {
    const publicKeyBuffer = decodeNodePublic(publicKey);
    publicKey = publicKeyBuffer.toString("hex").toUpperCase();
  }

  try {
    return rippleKeypairs.verify(message.toString("hex"), signature, publicKey);
  } catch (err) {
    console.log(err);
    // ignore
  }

  return false;
}
