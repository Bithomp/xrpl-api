import { encode, decode } from "ripple-binary-codec";
import { encodeNodePublic } from "ripple-address-codec";

import * as Validator from "../validator";

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
    manifestDecoded.address = Validator.classicAddressFromValidatorPK(publicKeyBuffer);
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

export function parseManifest(manifest: string): ManifestInterface {
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

  // Sequence
  verifyFields.push(buf.slice(lastSigning, cur));
  lastSigning = cur;

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
  decoded.address = Validator.classicAddressFromValidatorPK(buf.slice(cur, cur + 33)) as string;
  cur += 33;

  // PublicKey
  verifyFields.push(buf.slice(lastSigning, cur));
  lastSigning = cur;

  // signing public key
  // type 7 = VL, 3 = SigningPubKey | optional
  if (buf[cur++] === 0x73) {
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

    // SigningPubKey
    verifyFields.push(buf.slice(lastSigning, cur));
    lastSigning = cur;
  }

  // type 7 = VL, 6 = Signature | optional
  if (buf[cur++] === 0x76) {
    const signatureSize = buf[cur++];
    decoded.Signature = buf
      .slice(cur, cur + signatureSize)
      .toString("hex")
      .toUpperCase();
    cur += signatureSize;
    lastSigning = cur;
  }

  // Domain field | optional
  if (buf[cur] === 0x77) {
    cur++;
    const domainSize = buf[cur++];
    decoded.Domain = buf
      .slice(cur, cur + domainSize)
      .toString("hex")
      .toUpperCase();
    decoded.domain = buf.slice(cur, cur + domainSize).toString("utf-8");
    cur += domainSize;

    // Domain
    verifyFields.push(buf.slice(lastSigning, cur));
    lastSigning = cur;
  }

  // Master signature
  // type 7 = VL, 0 = uncommon field
  if (buf[cur++] !== 0x70) {
    decoded.error = "Missing Master Signature";
    return decoded;
  }

  // un field = 0x12 master signature
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
  if (decoded.SigningPubKey && decoded.Signature) {
    if (!Validator.verify(decoded.verifyFields, decoded.Signature, decoded.SigningPubKey)) {
      decoded.error = "Ephemeral signature does not match";
      return decoded;
    }
  }

  if (!Validator.verify(decoded.verifyFields, decoded.MasterSignature, decoded.PublicKey)) {
    decoded.error = "Master signature does not match";
    return decoded;
  }

  return decoded;
}

export interface GenerateanifestInterface {
  Sequence: number;
  PublicKey: string;
  SigningPubKey: string;
  Domain?: string;
  SigningPrivateKey: string;
  MasterPrivateKey: string;
}

export function generateManifest(manifest: GenerateanifestInterface): string {
  const verifyFields = [Buffer.from("MAN\x00", "utf-8")];

  // Sequence
  const secuenceBuffer = Buffer.alloc(5);
  secuenceBuffer.writeUInt8(0x24);
  secuenceBuffer.writeUInt32BE(manifest.Sequence, 1);
  verifyFields.push(secuenceBuffer);

  // PublicKey
  const publicKeyBuffer = Buffer.alloc(35);
  publicKeyBuffer.writeUInt8(0x71);
  publicKeyBuffer.writeUInt8(manifest.PublicKey.length / 2, 1);
  publicKeyBuffer.write(manifest.PublicKey, 2, "hex");
  verifyFields.push(publicKeyBuffer);

  // SigningPubKey
  const signingPubKeyBuffer = Buffer.alloc(35);
  signingPubKeyBuffer.writeUInt8(0x73);
  signingPubKeyBuffer.writeUInt8(manifest.SigningPubKey.length / 2, 1);
  signingPubKeyBuffer.write(manifest.SigningPubKey, 2, "hex");
  verifyFields.push(signingPubKeyBuffer);

  // Domain
  if (manifest.Domain) {
    const domainBuffer = Buffer.alloc(2 + manifest.Domain.length / 2);
    domainBuffer.writeUInt8(0x77);
    domainBuffer.writeUInt8(manifest.Domain.length / 2, 1);
    domainBuffer.write(manifest.Domain, 2, "hex");
    verifyFields.push(domainBuffer);
  }

  const verifyData = Buffer.concat(verifyFields);

  // Signature
  const ephemeralSignature = Validator.sign(verifyData, manifest.SigningPrivateKey);

  // MasterSignature
  const masterSignature = Validator.sign(verifyData, manifest.MasterPrivateKey);

  const manifestBuffer = Buffer.from(
    encode({
      Sequence: manifest.Sequence,
      PublicKey: manifest.PublicKey,
      SigningPubKey: manifest.SigningPubKey,
      Signature: ephemeralSignature,
      Domain: manifest.Domain,
      MasterSignature: masterSignature,
    }),
    "hex"
  );
  return manifestBuffer.toString("base64");
}
