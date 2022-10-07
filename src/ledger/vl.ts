import * as rippleKeypairs from "ripple-keypairs";
import * as Client from "../client";
import { VLInterface, ValidatorInterface, VLBlobInterface, encodeVLBlob } from "../models/vl";
import { generateManifest } from "../models/manifest";
import { unixTimeToLedgerTime } from "../models/ledger";

export async function createVL(
  publicKey: string,
  privateKey: string,
  sequence: number,
  expiration: number, // unixtime
  validatorsPublicKeys: string[] // list of validators public addresses
): Promise<VLInterface> {
  const vlBlob = await createVLBlob(sequence, expiration, validatorsPublicKeys);
  const blob = encodeVLBlob(vlBlob);

  const seed = rippleKeypairs.generateSeed({ algorithm: "ecdsa-secp256k1" });
  const ephimeral = rippleKeypairs.deriveKeypair(seed);
  const manifest = generateManifest({
    Sequence: sequence,
    PublicKey: publicKey,
    SigningPubKey: ephimeral.publicKey,
    SigningPrivateKey: ephimeral.privateKey,
    MasterPrivateKey: privateKey,
  });

  return {
    version: 1,
    public_key: publicKey,
    manifest,
    blob,
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
