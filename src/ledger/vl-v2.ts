import { VLInterface, VLBlobInterface, VLBlobsV2Interface, VLSecretKeysInterface, encodeVLBlob } from "../models/vl";
import { generateManifest } from "../models/manifest";
import { unixTimeToLedgerTime } from "../models/ledger";
import * as Validator from "../validator";
import { getVLBlobValidatorsManifest } from "./vl";
import { removeUndefined } from "../common";

interface VLV2ValidatorsPublishBlobInterface {
  sequence: number;
  effective?: number;
  expiration: number;
  validatorsPublicKeys: string[];
}

/**
 * @param {VLSecretKeysInterface} masterKey
 * @param {VLSecretKeysInterface} ephemeralKey
 * @param {VLV2ValidatorsPublicKeysBlobInterface[]} publishBlobs
 * @returns {Promise<VLInterface>}
 * @exception {Error}
 */
export async function createVLv2(
  masterKey: VLSecretKeysInterface,
  ephemeralKey: VLSecretKeysInterface,
  publishBlobs: VLV2ValidatorsPublishBlobInterface[]
): Promise<VLInterface> {
  if (!masterKey) {
    throw new Error("Master key is required");
  }

  if (!ephemeralKey) {
    throw new Error("Ephemeral key is required");
  }

  // sequence of the first blob
  let globalSequence: number | undefined;

  const blobs: VLBlobsV2Interface[] = [];
  for (const publishBlob of publishBlobs) {
    const { sequence, effective, expiration, validatorsPublicKeys } = publishBlob;

    if (typeof sequence !== "number") {
      throw new Error("sequence must be a number.");
    }

    if (typeof effective !== "number" && effective !== undefined) {
      throw new Error("effective must be a number.");
    }

    if (typeof expiration !== "number") {
      throw new Error("expiration must be a number.");
    }

    if (Array.isArray(validatorsPublicKeys) === false) {
      throw new Error("validatorsPublicKeys must be an array.");
    }

    if (validatorsPublicKeys.length === 0) {
      throw new Error("validatorsPublicKeys must not be empty.");
    }

    for (const publicKey of validatorsPublicKeys) {
      if (typeof publicKey !== "string") {
        throw new Error("validatorsPublicKeys must be an array of strings.");
      }

      if (publicKey[0] !== "n") {
        throw new Error("validatorsPublicKeys must be an array of strings starting with 'n'.");
      }
    }

    const blobInfo: VLBlobsV2Interface = {};

    const vlBlob = await createVLBlobV2(sequence, effective, expiration, validatorsPublicKeys);
    blobInfo.blob = encodeVLBlob(vlBlob);
    blobInfo.signature = Validator.sign(Buffer.from(blobInfo.blob, "base64"), ephemeralKey.privateKey);

    if (globalSequence === undefined) {
      globalSequence = sequence;
    } else if (globalSequence !== sequence) {
      // create local manifest if only it has different sequence
      blobInfo.manifest = generateManifest({
        Sequence: sequence,
        PublicKey: masterKey.publicKey,
        SigningPubKey: ephemeralKey.publicKey,
        SigningPrivateKey: ephemeralKey.privateKey,
        MasterPrivateKey: masterKey.privateKey,
      });
    }

    blobs.push(blobInfo);
  }

  if (globalSequence === undefined) {
    throw new Error("sequence must be a number.");
  }

  const globalManifest = generateManifest({
    Sequence: globalSequence,
    PublicKey: masterKey.publicKey,
    SigningPubKey: ephemeralKey.publicKey,
    SigningPrivateKey: ephemeralKey.privateKey,
    MasterPrivateKey: masterKey.privateKey,
  });

  return {
    "blobs-v2": blobs,
    manifest: globalManifest,
    public_key: masterKey.publicKey,
    version: 2,
  };
}

export async function createVLBlobV2(
  sequence: number,
  effective: number | undefined,
  expiration: number,
  validatorsPublicKeys: string[]
): Promise<VLBlobInterface> {
  const validators = await getVLBlobValidatorsManifest(validatorsPublicKeys);

  return removeUndefined({
    sequence,
    effective: effective ? unixTimeToLedgerTime(effective) : undefined, // convert unixtime to ripple time
    expiration: unixTimeToLedgerTime(expiration), // convert unixtime to ripple time
    validators,
  });
}
