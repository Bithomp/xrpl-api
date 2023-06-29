import * as Client from "../client";
import { VLInterface, ValidatorInterface, VLBlobInterface, encodeVLBlob } from "../models/vl";
import { generateManifest } from "../models/manifest";
import { unixTimeToLedgerTime } from "../models/ledger";
import * as Validator from "../validator";

/**
 * @param {string} masterSecret.privateKey
 * @param {string} masterSecret.publicKey
 * @param {string} ephemeralSecret.privateKey
 * @param {string} ephemeralSecret.publicKey
 * @param {number} sequence
 * @param {number} expiration
 * @param {string[]} validatorsPublicKeys
 * @returns {Promise<VLInterface>}
 * @exception {Error}
 */
export async function createVL(
  masterSecret: { privateKey: string; publicKey: string },
  ephemeralSecret: { privateKey: string; publicKey: string },
  sequence: number,
  expiration: number, // unixtime
  validatorsPublicKeys: string[] // list of validators public addresses
): Promise<VLInterface> {
  if (!masterSecret) {
    throw new Error("Master key is required");
  }

  if (!ephemeralSecret) {
    throw new Error("Ephemeral key is required");
  }

  if (typeof sequence !== "number") {
    throw new Error("sequence must be a number.");
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

  const vlBlob = await createVLBlob(sequence, expiration, validatorsPublicKeys);
  const blob = encodeVLBlob(vlBlob);
  const manifest = generateManifest({
    Sequence: sequence,
    PublicKey: masterSecret.publicKey,
    SigningPubKey: ephemeralSecret.publicKey,
    SigningPrivateKey: ephemeralSecret.privateKey,
    MasterPrivateKey: masterSecret.privateKey,
  });
  const signature = Validator.sign(Buffer.from(blob, "base64"), ephemeralSecret.privateKey);

  return {
    blob,
    manifest,
    signature,
    public_key: masterSecret.publicKey,
    version: 1,
  };
}

export async function createVLBlob(
  sequence: number,
  expiration: number,
  validatorsPublicKeys: string[]
): Promise<VLBlobInterface> {
  const validators = await getVLBlobValidatorsManifets(validatorsPublicKeys);

  return {
    sequence,
    expiration: unixTimeToLedgerTime(expiration), // convert unixtime to ripple time
    validators,
  };
}

export async function getVLBlobValidatorsManifets(validatorsPublicKeys: string[]): Promise<ValidatorInterface[]> {
  const connection: any = Client.findConnection("manifest");
  if (!connection) {
    throw new Error("There is no connection");
  }

  const validatorsManifests = await Promise.all(
    validatorsPublicKeys.map(async (publicKey) => {
      const response = await connection.request({
        command: "manifest",
        public_key: publicKey,
      });

      if (response.error) {
        Promise.reject(response.error);
      }

      return response.result;
    })
  );

  const validators = validatorsManifests.map((info) => {
    const validationPublicKey = info.requested;
    const manifest = info.manifest;

    return {
      validation_public_key: validationPublicKey,
      manifest,
    };
  });

  return validators;
}
