import { decode } from "ripple-binary-codec";
import { encodeNodePublic } from "ripple-address-codec";

import elliptic from "elliptic";
const ed25519 = new elliptic.eddsa("ed25519");

import { classicAddressFromValidatorPK } from "../validator";

export interface ManifestInterface {
  Sequence?: number;
  PublicKey?: string;
  publicKey?: string; // decoded
  address?: string; // decoded
  SigningPubKey?: string;
  signingPubKey?: string; // decoded
  Signature?: string;
  Domain?: string;
  domain?: string; // decoded
  MasterSignature?: string;
  verifyFields?: Buffer;
  error?: string;
}

export function decodeManifest(manifest: string): ManifestInterface {
  const manifestHex = Buffer.from(manifest, "base64").toString("hex").toUpperCase();
  const manifestDecoded = decode(manifestHex);

  if (!manifestDecoded) {
    return manifestDecoded;
  }

  const { PublicKey, SigningPubKey, Domain } = manifestDecoded;
  if (typeof PublicKey === "string") {
    const publicKeyBuffer = Buffer.from(PublicKey, "hex");

    manifestDecoded.publicKey = encodeNodePublic(publicKeyBuffer);
    manifestDecoded.address = classicAddressFromValidatorPK(publicKeyBuffer);
  }

  if (typeof SigningPubKey === "string") {
    const signingKeyBuffer = Buffer.from(SigningPubKey, "hex");
    manifestDecoded.signingPubKey = encodeNodePublic(signingKeyBuffer);
  }

  if (typeof Domain === "string") {
    manifestDecoded.domain = Buffer.from(Domain, "hex").toString("utf8");
  }

  return manifestDecoded;
}

export function parseManifest(manifest: string, publicKey?: string): ManifestInterface {
  const buf = Buffer.from(manifest, "base64");
  const decoded: ManifestInterface = {};
  let cur = 0;
  const verifyFields = [Buffer.from("MAN\x00", "utf-8")];
  let lastSigning = 0;

  // sequence number
  if (buf[cur++] !== 0x24) {
    decoded.error = "Missing Sequence Number";
    return decoded;
  }

  // tslint:disable-next-line:no-bitwise
  decoded.Sequence = (buf[cur] << 24) + (buf[cur + 1] << 16) + (buf[cur + 2] << 8) + buf[cur + 3];
  cur += 4;

  // public key
  // type 7 = VL, 1 = PublicKey
  if (buf[cur++] !== 0x71) {
    decoded.error = "Missing Public Key";
    return decoded;
  }

  // one byte size
  if (buf[cur++] !== 33) {
    decoded.error = "Missing Public Key size";
    return decoded;
  }
  decoded.PublicKey = buf
    .slice(cur, cur + 33)
    .toString("hex")
    .toUpperCase();
  decoded.publicKey = encodeNodePublic(buf.slice(cur, cur + 33));
  decoded.address = classicAddressFromValidatorPK(buf.slice(cur, cur + 33)) as string;
  cur += 33;

  // signing public key
  // type 7 = VL, 3 = SigningPubKey
  if (buf[cur++] !== 0x73) {
    decoded.error = "Missing Signing Public Key";
    return decoded;
  }

  // one byte size
  if (buf[cur++] !== 33) {
    decoded.error = "Missing Signing Public Key size";
    return decoded;
  }

  decoded.SigningPubKey = buf
    .slice(cur, cur + 33)
    .toString("hex")
    .toUpperCase();
  decoded.signingPubKey = encodeNodePublic(buf.slice(cur, cur + 33));
  cur += 33;

  // signature
  verifyFields.push(buf.slice(lastSigning, cur));

  // // type 7 = VL, 6 = Signature
  if (buf[cur++] !== 0x76) {
    decoded.error = "Missing Signature";
    return decoded;
  }

  const signatureSize = buf[cur++];
  decoded.Signature = buf
    .slice(cur, cur + signatureSize)
    .toString("hex")
    .toUpperCase();
  cur += signatureSize;
  lastSigning = cur;

  // domain field | optional
  if (buf[cur] === 0x77) {
    cur++;
    const domainSize = buf[cur++];
    decoded.Domain = buf
      .slice(cur, cur + domainSize)
      .toString("hex")
      .toUpperCase();
    decoded.domain = buf.slice(cur, cur + domainSize).toString("utf-8");
    cur += domainSize;
  }

  // master signature
  verifyFields.push(buf.slice(lastSigning, cur));
  // type 7 = VL, 0 = uncommon field
  if (buf[cur++] !== 0x70) {
    decoded.error = "Missing Master Signature";
    return decoded;
  }

  // // un field = 0x12 master signature
  if (buf[cur++] !== 0x12) {
    decoded.error = "Missing Master Signature follow byte";
    return decoded;
  }

  const masterSize = buf[cur++];
  decoded.MasterSignature = buf
    .slice(cur, cur + masterSize)
    .toString("hex")
    .toUpperCase();
  cur += masterSize;
  lastSigning = cur; // here in case more fields ever added below

  if (cur !== buf.length) {
    decoded.error = "Extra bytes at end of manifest";
    return decoded;
  }

  // for signature verification
  decoded.verifyFields = Buffer.concat(verifyFields);

  if (publicKey) {
    const masterKey = ed25519.keyFromPublic(publicKey.slice(2), "hex");
    if (!masterKey.verify(decoded.verifyFields, decoded.MasterSignature)) {
      decoded.error = "Master signature does not match";
      return decoded;
    }
  }

  return decoded;
}
