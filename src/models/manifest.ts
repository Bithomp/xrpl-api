import { decode } from "ripple-binary-codec";
import { encodeNodePublic } from "ripple-address-codec";
import { classicAddressFromValidatorPK } from "../validator";

export function decodeManifest(manifest: string): object {
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
