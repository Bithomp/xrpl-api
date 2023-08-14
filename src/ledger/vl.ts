import * as Client from "../client";
import { VLInterface, ValidatorInterface, VLBlobInterface, VLSecretKeysInterface, encodeVLBlob } from "../models/vl";
import { generateManifest } from "../models/manifest";
import { unixTimeToLedgerTime } from "../models/ledger";
import * as Validator from "../validator";

/**
 * @param {string} masterKey.privateKey
 * @param {string} masterKey.publicKey
 * @param {string} ephemeralKey.privateKey
 * @param {string} ephemeralKey.publicKey
 * @param {number} sequence
 * @param {number} expiration
 * @param {string[]} validatorsPublicKeys
 * @returns {Promise<VLInterface>}
 * @exception {Error}
 */
export async function createVL(
  masterKey: VLSecretKeysInterface,
  ephemeralKey: VLSecretKeysInterface,
  sequence: number,
  expiration: number, // unixtime
  validatorsPublicKeys: string[] // list of validators public addresses
): Promise<VLInterface> {
  if (!masterKey) {
    throw new Error("Master key is required");
  }

  if (!ephemeralKey) {
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
    PublicKey: masterKey.publicKey,
    SigningPubKey: ephemeralKey.publicKey,
    SigningPrivateKey: ephemeralKey.privateKey,
    MasterPrivateKey: masterKey.privateKey,
  });
  const signature = Validator.sign(Buffer.from(blob, "base64"), ephemeralKey.privateKey);

  return {
    blob,
    manifest,
    signature,
    public_key: masterKey.publicKey,
    version: 1,
  };
}

export async function createVLBlob(
  sequence: number,
  expiration: number,
  validatorsPublicKeys: string[]
): Promise<VLBlobInterface> {
  const validators = await getVLBlobValidatorsManifest(validatorsPublicKeys);

  return {
    sequence,
    expiration: unixTimeToLedgerTime(expiration), // convert unixtime to ripple time
    validators,
  };
}

export async function getVLBlobValidatorsManifest(validatorsPublicKeys: string[]): Promise<ValidatorInterface[]> {
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
