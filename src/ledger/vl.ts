import * as Client from "../client";
import { VLInterface, ValidatorInterface, VLBlobInterface, encodeVLBlob } from "../models/vl";
import { generateManifest } from "../models/manifest";
import { unixTimeToLedgerTime } from "../models/ledger";

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

  const vlBlob = await createVLBlob(sequence, expiration, validatorsPublicKeys);
  const blob = encodeVLBlob(vlBlob);
  const manifest = generateManifest({
    Sequence: sequence,
    PublicKey: masterSecret.publicKey,
    SigningPubKey: ephemeralSecret.publicKey,
    SigningPrivateKey: ephemeralSecret.privateKey,
    MasterPrivateKey: masterSecret.privateKey,
  });

  return {
    blob,
    public_key: masterSecret.publicKey,
    manifest,
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
