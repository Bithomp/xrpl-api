import { parseManifest, ManifestInterface } from "./manifest";
import { parseUint32, parseUint64 } from "./utils";
import { ledgerTimeToUnixTime } from "./ledger";
import * as Validator from "../validator";

export interface VLInterface {
  // unsigned integer representing the VL format version. Both
  // 1 and 2 will be valid, with 1 the old format, and
  // 2 the new.
  version?: number;

  // string representing the publisher's hex-encoded master
  // public key,
  public_key?: string;

  // string representing the base-64 or hex-encoded manifest
  // containing the publisher's master, signing public keys,
  manifest?: string;

  // string representing base-64 encoded JSON containing the actual list.
  // for version 1
  blob?: string;

  // list of blobs for version 2
  "blobs-v2"?: VLBlobInfoInterface[];

  // string representing the base-64 or hex-encoded signature
  // of the blob, using the ephemeral(signing) private key,
  // for version 1
  signature?: string;
}

export interface ParsedVLInterface {
  // unsigned integer representing the VL format version. Both
  // 1 and 2 will be valid, with 1 the old format, and
  // 2 the new.
  version?: number;

  // string representing the publisher's hex-encoded master
  // public key
  PublicKey?: string;

  // string representing the base-64 or hex-encoded manifest
  // containing the publisher's master, signing public keys
  manifest?: string;

  // decoded manifest
  decodedManifest?: ManifestInterface;

  // decoded blob for version 1
  blob?: ParsedVLBlobInterface;

  // list of blobs for version 2
  blobs?: ParsedVLBlobInterface[];

  // string representing the base-64 or hex-encoded signature
  // of the blob, using the ephemeral(signing) private key,
  // for version 1
  signature?: string;

  // error message if any was encountered during parsing of the VL
  error?: string;
}

export interface ValidatorInterface {
  // string representing base58-encoded public key, starts with `n`
  validation_public_key?: string;

  // string representing the base-64 or hex-encoded manifest
  manifest?: string;
}

export interface ParsedValidatorInterface {
  // string representing hex-encoded public key,
  PublicKey?: string;

  // string representing the base-64 or hex-encoded manifest
  manifest?: string;

  // decoded manifest
  decodedManifest?: ManifestInterface;
}

export interface VLBlobInterface {
  // Unsigned integer sequence of this VL. The sequence number
  // must increase monotonically. More specifically, validator lists with
  // sequences less than the current are ignored. The special sequence
  // UInt(-1) indicates that the master key is revoked,
  sequence?: number;

  // Unsigned integer representing the ripple
  // time point when the list will become valid,
  // supported only by vl list version 2.
  effective?: number; // ripple time in seconds

  // Unsigned integer representing the ripple time point when
  // this list will no longer be valid,
  expiration?: number; // ripple time in seconds

  // Array of validator objects.
  validators?: ValidatorInterface[];
}

export interface ParsedVLBlobInterface {
  // Unsigned integer sequence of this VL. The sequence number
  // must increase monotonically. More specifically, validator lists with
  // sequences less than the current are ignored. The special sequence
  // UInt(-1) indicates that the master key is revoked,
  sequence?: number;

  // Unsigned integer representing the ripple
  // time point when the list will become valid,
  // supported only by vl list version 2.
  effective?: number; // unix time in seconds

  // Unsigned integer representing the ripple time point when
  // this list will no longer be valid,
  expiration?: number; // unix time in seconds

  validators?: ParsedValidatorInterface[];

  // string representing the base-64 or hex-encoded signature
  // of the blob, using the ephemeral(signing) private key,
  // for version 2
  signature?: string;

  // string representing the base-64 or hex-encoded manifest
  // containing the publisher's master, signing public keys,
  // optional
  manifest?: string;

  // decoded manifest, optional
  decodedManifest?: ManifestInterface;
}

// can be any ed25519 (publicKey starts on `ED`) or secp256k1 could be used,
// can ne generated with BithompXRPL.Validator.generateSecrets() or by generateSeed from ripple-keypairs
// should not belong to any validators keys in the list
export interface VLSecretKeysInterface {
  // string representing encoded in base58, starts with `p`
  privateKey: string;

  // string representing hex-encoded public key,
  publicKey: string;
}

export interface VLV2ValidatorsPublishBlobInterface {
  // Unsigned integer sequence of this VL. The sequence number
  // must increase monotonically. More specifically, validator lists with
  // sequences less than the current are ignored. The special sequence
  // UInt(-1) indicates that the master key is revoked,
  sequence?: number;

  // Unsigned integer representing the ripple
  // time point when the list will become valid,
  effective?: number; // unix time in seconds

  // Unsigned integer representing the ripple time point when
  // this list will no longer be valid,
  expiration?: number; // unix time in seconds

  // Array of validators base58-encoded public keys starts with `n`
  validatorsPublicKeys: string[];
}

export interface VLBlobInfoInterface {
  // string representing base-64 encoded JSON containing the actual list.
  blob?: string;

  // string representing the base-64 or hex-encoded signature
  // of the blob, using the ephemeral(signing) private key,
  signature?: string;

  // string representing the base-64 or hex-encoded manifest
  // containing the publisher's master, signing public keys,
  // optional
  manifest?: string;
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
export function parseVL(vl: VLInterface): ParsedVLInterface {
  const decoded: ParsedVLInterface = {};

  decoded.version = vl.version;
  if (decoded.version !== 1 && decoded.version !== 2) {
    decoded.error = "Invalid version";
  }

  decoded.PublicKey = vl.public_key;

  decoded.manifest = vl.manifest;
  let error = isValidVLFormat(vl);
  if (error) {
    decoded.error = error;
  }

  decoded.decodedManifest = parseManifest(vl.manifest as string);
  if (!decoded.error && decoded.decodedManifest.error) {
    decoded.error = decoded.decodedManifest.error;
  }

  if (
    !decoded.error &&
    decoded.PublicKey !== decoded.decodedManifest.PublicKey &&
    decoded.PublicKey !== decoded.decodedManifest.SigningPubKey
  ) {
    decoded.error = "PublicKey does not match manifest";
  }

  if (decoded.version === 1) {
    decoded.signature = vl.signature;
    if (!decoded.error && !decoded.signature) {
      decoded.error = "Signature (blob) is missing";
    }

    if (decoded.signature && decoded.decodedManifest.SigningPubKey && vl.blob) {
      if (
        !decoded.error &&
        !Validator.verify(Buffer.from(vl.blob, "base64"), decoded.signature, decoded.decodedManifest.SigningPubKey)
      ) {
        decoded.error = "Signature is not valid";
      }
    }

    const blob = decodeVLBlob(vl.blob as string);
    error = isValidVLBlob(blob);
    if (!decoded.error && error) {
      decoded.error = error;
    }

    decoded.blob = {
      sequence: blob?.sequence,
      expiration: ledgerTimeToUnixTime(blob?.expiration as number),
      validators: [],
    };

    // validators
    for (const validator of blob?.validators as ValidatorInterface[]) {
      error = isValidVLBlobValidator(validator);
      if (!decoded.error && error) {
        decoded.error = error;
      }

      const validatorManifest = parseManifest(validator.manifest as string);
      if (!decoded.error && validatorManifest.error) {
        decoded.error = validatorManifest.error;
      }

      if (decoded.blob.validators) {
        decoded.blob.validators.push({
          PublicKey: validator.validation_public_key,
          manifest: validator.manifest,
          decodedManifest: validatorManifest,
        });
      }
    }
  } else if (decoded.version === 2) {
    const blobs = vl["blobs-v2"] as VLBlobInfoInterface[];
    if (!decoded.blobs) {
      decoded.blobs = [];
    }

    for (const blobInfo of blobs) {
      const blob = decodeVLBlob(blobInfo.blob as string);
      error = isValidVLBlob(blob);
      if (!decoded.error && error) {
        decoded.error = error;
      }

      const decodedBlob: ParsedVLBlobInterface = {
        sequence: blob?.sequence,
        expiration: ledgerTimeToUnixTime(blob?.expiration as number),
        signature: blobInfo.signature,
        validators: [],
      };

      if (blob?.effective) {
        decodedBlob.effective = ledgerTimeToUnixTime(blob.effective);
      }

      if (blobInfo?.manifest) {
        decodedBlob.manifest = blobInfo.manifest;
        decodedBlob.decodedManifest = parseManifest(blobInfo.manifest as string);
        if (!decoded.error && decodedBlob.decodedManifest.error) {
          decoded.error = decodedBlob.decodedManifest.error;
        }
      }

      // use local or global manifest
      const decodedManifest = decodedBlob.decodedManifest || decoded.decodedManifest;
      if (
        !decoded.error &&
        decoded.PublicKey !== decodedManifest.PublicKey &&
        decoded.PublicKey !== decodedManifest.SigningPubKey
      ) {
        decoded.error = "PublicKey does not match manifest";
      }

      if (!decoded.error && !decodedBlob.signature) {
        decoded.error = "Signature (blob) is missing";
      }

      if (decodedBlob.signature && decodedManifest.SigningPubKey && blobInfo.blob) {
        if (
          !decoded.error &&
          !Validator.verify(Buffer.from(blobInfo.blob, "base64"), decodedBlob.signature, decodedManifest.SigningPubKey)
        ) {
          decoded.error = "Signature is not valid";
        }
      }

      // validators
      for (const validator of blob?.validators as ValidatorInterface[]) {
        error = isValidVLBlobValidator(validator);
        if (!decoded.error && error) {
          decoded.error = error;
        }

        const validatorManifest = parseManifest(validator.manifest as string);
        if (!decoded.error && validatorManifest.error) {
          decoded.error = validatorManifest.error;
        }

        if (decodedBlob.validators) {
          decodedBlob.validators.push({
            PublicKey: validator.validation_public_key,
            manifest: validator.manifest,
            decodedManifest: validatorManifest,
          });
        }
      }

      decoded.blobs.push(decodedBlob);
    }
  }

  return decoded;
}

export function isValidVL(vl: VLInterface): string | null {
  let error = isValidVLFormat(vl);
  if (error) {
    return error;
  }

  const vlManifest = parseManifest(vl.manifest as string);
  if (vlManifest.error) {
    return vlManifest.error;
  }

  if (vl.version === 1) {
    const blob: VLBlobInterface = decodeVLBlob(vl.blob as string);
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
  } else if (vl.version === 2) {
    const blobs = vl["blobs-v2"] as VLBlobInfoInterface[];
    for (const blobInfo of blobs) {
      const blob: VLBlobInterface = decodeVLBlob(blobInfo.blob as string);
      error = isValidVLBlob(blob);
      if (error) {
        return error;
      }

      for (const validator of blob?.validators as ValidatorInterface[]) {
        error = isValidVLBlobValidator(validator);
        if (error) {
          return error;
        }
      }
    }
  } else {
    return "Invalid version";
  }

  return error;
}

function isValidVLFormat(vl: VLInterface): string | null {
  const { version, public_key, manifest, blob } = vl;
  let error: string | null = null;

  if (version === undefined) {
    error = "Version missing from vl";
  } else if (public_key === undefined) {
    error = "Public key missing from vl";
  } else if (manifest === undefined) {
    error = "Manifest missing from vl";
  } else if (version === 1) {
    if (blob === undefined) {
      error = "Blob missing from vl";
    }
  } else if (version === 2) {
    if (blob !== undefined) {
      error = "Blob should not be present in vl version 2";
    } else if (vl["blobs-v2"] === undefined) {
      error = "blobs-v2 missing from vl";
    } else if (!Array.isArray(vl["blobs-v2"])) {
      error = "blobs-v2 should be an array";
    } else if (vl["blobs-v2"].length === 0) {
      error = "blobs-v2 should not be empty";
    }
  } else {
    error = "Version is not supported";
  }

  return error;
}

function decodeVLBlob(blob: string): VLBlobInterface {
  const decoded = Buffer.from(blob, "base64").toString("ascii");

  return JSON.parse(decoded);
}

export function encodeVLBlob(vlBlob: VLBlobInterface): string {
  return Buffer.from(JSON.stringify(vlBlob)).toString("base64");
}

function isValidVLBlob(blob: VLBlobInterface): string | null {
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

  const parsedManifest = parseManifest(manifest as string);
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
  if (buf[cur++] !== 0x22 || buf.length - cur < 5) {
    decoded.error = "sfFlags missing or incomplete";
    return decoded;
  }
  decoded.Flags = parseInt(parseUint32(buf, cur), 10);
  cur += 4;

  // LedgerSequence
  if (buf[cur++] !== 0x26 || buf.length - cur < 5) {
    decoded.error = "sfLedgerSequnece missing or incomplete";
    return decoded;
  }
  decoded.LedgerSequence = parseInt(parseUint32(buf, cur), 10);
  cur += 4;

  // CloseTime (optional)
  if (buf[cur] === 0x27) {
    cur++;
    if (buf.length - cur < 4) {
      decoded.error = "sfCloseTime missing or incomplete";
      return decoded;
    }
    decoded.CloseTime = parseInt(parseUint32(buf, cur), 10);
    cur += 4;
  }

  // SigningTime
  if (buf[cur++] !== 0x29 || buf.length - cur < 5) {
    decoded.error = "sfSigningTime missing or incomplete";
    return decoded;
  }
  decoded.SigningTime = parseInt(parseUint32(buf, cur), 10);
  cur += 4;

  // LoadFee (optional)
  if (buf[cur] === 0x20 && buf.length - cur >= 1 && buf[cur + 1] === 0x18) {
    cur += 2;
    if (buf.length - cur < 4) {
      decoded.error = "sfLoadFee payload missing";
      return decoded;
    }
    decoded.LoadFee = parseUint32(buf, cur);
    cur += 4;
  }

  // ReserveBase (optional)
  if (buf[cur] === 0x20 && buf.length - cur >= 1 && buf[cur + 1] === 0x1f) {
    cur += 2;
    if (buf.length - cur < 4) {
      decoded.error = "sfReserveBase payload missing";
      return decoded;
    }
    decoded.ReserveBase = parseUint32(buf, cur);
    cur += 4;
  }

  // ReserveIncrement (optional)
  if (buf[cur] === 0x20 && buf.length - cur >= 1 && buf[cur + 1] === 0x20) {
    cur += 2;
    if (buf.length - cur < 4) {
      decoded.error = "sfReserveIncrement payload missing";
      return decoded;
    }
    decoded.ReserveIncrement = parseUint32(buf, cur);
    cur += 4;
  }

  // BaseFee (optional)
  if (buf[cur] === 0x35) {
    cur++;
    if (buf.length - cur < 8) {
      decoded.error = "sfBaseFee missing or incomplete";
      return decoded;
    }
    decoded.BaseFee = parseUint64(buf, cur);
    cur += 8;
  }

  // Cookie (optional)
  if (buf[cur] === 0x3a) {
    cur++;
    if (buf.length - cur < 8) {
      decoded.error = "sfCookie missing or incomplete";
      return decoded;
    }
    decoded.Cookie = parseUint64(buf, cur);
    cur += 8;
  }

  // ServerVersion (optional)
  if (buf[cur] === 0x3b) {
    cur++;
    if (buf.length - cur < 8) {
      decoded.error = "sfServerVersion missing or incomplete";
      return decoded;
    }
    decoded.ServerVersion = parseUint64(buf, cur);
    cur += 8;
  }

  // LedgerHash
  if (buf[cur++] !== 0x51 || buf.length - cur < 5) {
    decoded.error = "sfLedgerHash missing or incomplete";
    return decoded;
  }
  decoded.LedgerHash = buf
    .slice(cur, cur + 32)
    .toString("hex")
    .toUpperCase();
  cur += 32;

  // ConsensusHash
  if (buf[cur] === 0x50 && buf.length - cur >= 1 && buf[cur + 1] === 0x17) {
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
  if (buf[cur] === 0x50 && buf.length - cur >= 1 && buf[cur + 1] === 0x19) {
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
  if (buf[cur++] !== 0x73 || buf.length - cur < 2) {
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
  const sigStart = cur;
  if (buf[cur++] !== 0x76 || buf.length - cur < 2) {
    decoded.error = "sfSignature missing or incomplete";
    return decoded;
  }
  const sigSize = buf[cur++];
  if (buf.length - cur < sigSize) {
    decoded.error = "sfSignature payload missing";
    return decoded;
  }
  decoded.Signature = buf
    .slice(cur, cur + sigSize)
    .toString("hex")
    .toUpperCase();
  cur += sigSize;
  const sigEnd = cur;

  // Amendments (optional)
  if (buf.length - cur >= 1 && buf[cur] === 0x03 && buf[cur + 1] === 0x13) {
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
  if (publicKey.toUpperCase() !== decoded.SigningPubKey) {
    decoded._verified = false;
    decoded.error = "SigningPubKey did not match or was not present";
    return decoded;
  }

  // Check signature
  const verifyFields = Buffer.concat([
    Buffer.from("VAL\x00", "utf-8"),
    buf.slice(0, sigStart),
    buf.slice(sigEnd, buf.length),
  ]);

  if (decoded.SigningPubKey && decoded.Signature) {
    if (!Validator.verify(verifyFields, decoded.Signature, decoded.SigningPubKey)) {
      decoded._verified = false;
      decoded.error = "Signature did not match or was not present";
      return decoded;
    }
  }

  decoded._verified = true;

  return decoded;
}
