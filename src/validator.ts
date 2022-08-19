import * as assert from "assert";
import AddressCodec = require("ripple-address-codec");
import * as Crypto from "crypto";
import * as Base58 from "./base58";

// public_key_from_validator_pk
export function publicKeyBufferFromValidatorPK(pk: string): Buffer {
  return AddressCodec.decodeNodePublic(pk);
}

// xrpl_address_from_validator_pk
export function classicAddressFromValidatorPK(pk: string | Buffer): string | null {
  let pubkey = pk;
  if (typeof pk === "string") {
    pubkey = publicKeyBufferFromValidatorPK(pk);
  }

  assert.ok(pubkey.length == 33);
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
