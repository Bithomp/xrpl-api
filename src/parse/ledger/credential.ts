import { AuthorizeCredential } from "xrpl";

import { FormattedAuthorizeCredentials } from "../../types/deposits";
import { decodeHexData } from "../utils";

export function parseCredentials(credential: AuthorizeCredential): FormattedAuthorizeCredentials {
  if (!credential.Credential) {
    return {};
  }

  return {
    issuer: credential.Credential.Issuer,
    type: decodeHexData(credential.Credential.CredentialType),
  };
}
