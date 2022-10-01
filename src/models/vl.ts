import { parseManifest } from "./manifest";
import { parseUint32, parseUint64 } from "./utils";
import crypto from "crypto";
import elliptic from "elliptic";
const secp256k1 = new elliptic.ec("secp256k1");
const ed25519 = new elliptic.eddsa("ed25519");

export interface VLInterface {
  version?: number;
  public_key?: string;
  manifest?: string;
  blob?: string;
}

export interface ValidatorInterface {
  validation_public_key?: string;
  manifest?: string;
}

export interface VLBlobInterface {
  sequence?: number;
  expiration?: string;
  validators?: ValidatorInterface[];
}

export interface VLDataInterface {
  Flags?: number;
  LedgerSequence?: number;
  CloseTime?: number;
  SigningTime?: number;
  LoadFee?: string;
  ReserveBase?: string;
  ReserveIncrement?: string;
  BaseFee?: string;
  Cookie?: string;
  ServerVersion?: string;
  LedgerHash?: string;
  ConsensusHash?: string;
  ValidatedHash?: string;
  SigningPubKey?: string;
  Signature?: string;
  Amendments?: string[];
  error?: string;
  _verified?: boolean;
}

// https://github.com/RichardAH/xrpl-fetch-unl/blob/main/fetch.js
export function isValidVL(vl: VLInterface): string | null {
  let error = isValidVLFormat(vl);
  if (error) {
    return error;
  }

  const vlManifest = parseManifest(vl.manifest as string, vl.public_key as string);
  if (vlManifest.error) {
    return vlManifest.error;
  }

  const blob: VLBlobInterface | null = decodeVLBlob(vl.blob as string);
  error = isValidVLBlob(blob);
  if (error) {
    return error;
  }

  // validators
  for (const validator of blob?.validators as ValidatorInterface[]) {
    error = isValidVLBlobValidator(validator);
    if (error) {
      return error;
    }
  }

  return error;
}

function isValidVLFormat(vl: VLInterface): string | null {
  const { version, public_key, manifest, blob } = vl;
  let error: string | null = null;

  if (version === undefined) {
    error = "Version missing from vl";
  }

  if (public_key === undefined) {
    error = "Public key missing from vl";
  }

  if (manifest === undefined) {
    error = "Manifest missing from vl";
  }

  if (blob === undefined) {
    error = "Blob missing from vl";
  }

  if (version !== 1) {
    error = "Version is not supported";
  }

  return error;
}

function decodeVLBlob(blob: string): VLBlobInterface | null {
  const decoded = Buffer.from(blob, "base64").toString("ascii");

  return JSON.parse(decoded);
}

function isValidVLBlob(blob: VLBlobInterface | null): string | null {
  if (blob === null) {
    return "Blob is not valid";
  }

  const { sequence, expiration, validators } = blob;
  let error: string | null = null;

  if (sequence === undefined) {
    error = "Sequence missing from blob";
  }

  if (expiration === undefined) {
    error = "Expiration missing from blob";
  }

  if (validators === undefined) {
    error = "Validators missing from blob";
  }

  if (validators && validators.length === 0) {
    error = "Validators is empty";
  }

  return error;
}

function isValidVLBlobValidator(validator: ValidatorInterface): string | null {
  const { validation_public_key, manifest } = validator;
  let error: string | null = null;

  if (validation_public_key === undefined) {
    error = "Validation public key missing from validator";
  }

  if (manifest === undefined) {
    error = "Manifest missing from validator";
  }

  const parsedManifest = parseManifest(manifest as string, validation_public_key as string);
  if (parsedManifest.error) {
    return parsedManifest.error;
  }

  return error;
}

export function parseValidationData(data: string, publicKey: string): VLDataInterface {
  const buf = Buffer.from(data, "hex");
  const decoded: VLDataInterface = {};
  let cur = 0;

  // Flags
  if (buf[cur++] != 0x22 || buf.length - cur < 5) {
    decoded.error = "sfFlags missing or incomplete";
    return decoded;
  }
  decoded.Flags = parseInt(parseUint32(buf, cur), 10);
  cur += 4;

  // LedgerSequence
  if (buf[cur++] != 0x26 || buf.length - cur < 5) {
    decoded.error = "sfLedgerSequnece missing or incomplete";
    return decoded;
  }
  decoded.LedgerSequence = parseInt(parseUint32(buf, cur), 10);
  cur += 4;

  // CloseTime (optional)
  if (buf[cur] == 0x27) {
    cur++;
    if (buf.length - cur < 4) {
      decoded.error = "sfCloseTime missing or incomplete";
      return decoded;
    }
    decoded.CloseTime = parseInt(parseUint32(buf, cur), 10);
    cur += 4;
  }

  // SigningTime
  if (buf[cur++] != 0x29 || buf.length - cur < 5) {
    decoded.error = "sfSigningTime missing or incomplete";
    return decoded;
  }
  decoded.SigningTime = parseInt(parseUint32(buf, cur), 10);
  cur += 4;

  // LoadFee (optional)
  if (buf[cur] == 0x20 && buf.length - cur >= 1 && buf[cur + 1] == 0x18) {
    cur += 2;
    if (buf.length - cur < 4) {
      decoded.error = "sfLoadFee payload missing";
      return decoded;
    }
    decoded.LoadFee = parseUint32(buf, cur);
    cur += 4;
  }

  // ReserveBase (optional)
  if (buf[cur] == 0x20 && buf.length - cur >= 1 && buf[cur + 1] == 0x1f) {
    cur += 2;
    if (buf.length - cur < 4) {
      decoded.error = "sfReserveBase payload missing";
      return decoded;
    }
    decoded.ReserveBase = parseUint32(buf, cur);
    cur += 4;
  }

  // ReserveIncrement (optional)
  if (buf[cur] == 0x20 && buf.length - cur >= 1 && buf[cur + 1] == 0x20) {
    cur += 2;
    if (buf.length - cur < 4) {
      decoded.error = "sfReserveIncrement payload missing";
      return decoded;
    }
    decoded.ReserveIncrement = parseUint32(buf, cur);
    cur += 4;
  }

  // BaseFee (optional)
  if (buf[cur] == 0x35) {
    cur++;
    if (buf.length - cur < 8) {
      decoded.error = "sfBaseFee missing or incomplete";
      return decoded;
    }
    decoded.BaseFee = parseUint64(buf, cur);
    cur += 8;
  }

  // Cookie (optional)
  if (buf[cur] == 0x3a) {
    cur++;
    if (buf.length - cur < 8) {
      decoded.error = "sfCookie missing or incomplete";
      return decoded;
    }
    decoded.Cookie = parseUint64(buf, cur);
    cur += 8;
  }

  // ServerVersion (optional)
  if (buf[cur] == 0x3b) {
    cur++;
    if (buf.length - cur < 8) {
      decoded.error = "sfServerVersion missing or incomplete";
      return decoded;
    }
    decoded.ServerVersion = parseUint64(buf, cur);
    cur += 8;
  }

  // LedgerHash
  if (buf[cur++] != 0x51 || buf.length - cur < 5) {
    decoded.error = "sfLedgerHash missing or incomplete";
    return decoded;
  }
  decoded.LedgerHash = buf
    .slice(cur, cur + 32)
    .toString("hex")
    .toUpperCase();
  cur += 32;

  // ConsensusHash
  if (buf[cur] == 0x50 && buf.length - cur >= 1 && buf[cur + 1] == 0x17) {
    cur += 2;
    if (buf.length - cur < 32) {
      decoded.error = "sfConsensusHash payload missing";
      return decoded;
    }
    decoded.ConsensusHash = buf
      .slice(cur, cur + 32)
      .toString("hex")
      .toUpperCase();
    cur += 32;
  }

  // ValidatedHash
  if (buf[cur] == 0x50 && buf.length - cur >= 1 && buf[cur + 1] == 0x19) {
    cur += 2;
    if (buf.length - cur < 32) {
      decoded.error = "sfValidatedHash payload missing";
      return decoded;
    }
    decoded.ValidatedHash = buf
      .slice(cur, cur + 32)
      .toString("hex")
      .toUpperCase();
    cur += 32;
  }

  // SigningPubKey
  if (buf[cur++] != 0x73 || buf.length - cur < 2) {
    decoded.error = "sfSigningPubKey missing or incomplete";
    return decoded;
  }
  const keySize = buf[cur++];
  if (buf.length - cur < keySize) {
    decoded.error = "sfSigningPubKey payload missing";
    return decoded;
  }
  decoded.SigningPubKey = buf
    .slice(cur, cur + keySize)
    .toString("hex")
    .toUpperCase();
  cur += keySize;

  // Signature
  let sig_start = cur;
  if (buf[cur++] != 0x76 || buf.length - cur < 2) {
    decoded.error = "sfSignature missing or incomplete";
    return decoded;
  }
  let sig_size = buf[cur++];
  if (buf.length - cur < sig_size) {
    decoded.error = "sfSignature payload missing";
    return decoded;
  }
  decoded.Signature = buf
    .slice(cur, cur + sig_size)
    .toString("hex")
    .toUpperCase();
  cur += sig_size;
  let sig_end = cur;

  // Amendments (optional)
  if (buf.length - cur >= 1 && buf[cur] == 0x03 && buf[cur + 1] == 0x13) {
    cur += 2;
    // parse variable length
    if (buf.length - cur < 1) {
      decoded.error = "sfAmendments payload missing or incomplete [1]";
      return decoded;
    }
    let len = buf[cur++];
    if (len <= 192) {
      // do nothing
    } else if (len >= 193 && len <= 240) {
      if (buf.length - cur < 1) {
        decoded.error = "sfAmendments payload missing or incomplete [2]";
        return decoded;
      }
      len = 193 + (len - 193) * 256 + buf[cur++];
    } else if (len >= 241 && len <= 254) {
      if (buf.length - cur < 2) {
        decoded.error = "sfAmendments payload missing or incomplete [3]";
        return decoded;
      }

      len = 12481 + (len - 241) * 65536 + buf[cur + 1] * 256 + buf[cur + 2];
      cur += 2;
    }

    if (buf.length - cur < len) {
      decoded.error = "sfAmendments payload missing or incomplete [3]";
      return decoded;
    }

    decoded.Amendments = [];
    const amendmentsCurEnd = cur + len;
    while (cur < amendmentsCurEnd) {
      decoded.Amendments.push(buf.slice(cur, cur + 32).toString("hex"));
      cur += 32;
    }
  }

  // Check public key
  if (publicKey.toUpperCase() != decoded.SigningPubKey) {
    decoded._verified = false;
    decoded.error = "SigningPubKey did not match or was not present";
    return decoded;
  }

  // Check signature
  const computedHash = crypto
    .createHash("sha512")
    .update(Buffer.concat([Buffer.from("VAL\x00", "utf-8"), buf.slice(0, sig_start), buf.slice(sig_end, buf.length)]))
    .digest()
    .toString("hex")
    .slice(0, 64);

  const verifyKey =
    publicKey.slice(2) == "ED"
      ? ed25519.keyFromPublic(publicKey.slice(2), "hex")
      : secp256k1.keyFromPublic(publicKey, "hex");

  if (!verifyKey.verify(computedHash, decoded["Signature"])) {
    decoded._verified = false;
    decoded.error = "Signature (ed25519) did not match or was not present";
    return decoded;
  }

  decoded._verified = true;

  return decoded;
}
