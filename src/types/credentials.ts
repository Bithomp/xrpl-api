import { FormattedAuthorizeCredentials } from "./deposits";
import { FormattedBaseSpecification } from "./specification";

export enum CredentialFlags {
  lsfAccepted = 0x00010000,
}

export const CredentialFlagsKeys = {
  accepted: CredentialFlags.lsfAccepted,
};

export interface CredentialFlagsKeysInterface {
  accepted: boolean;
}

export type FormattedCredentialCreateSpecification = {
  subject?: string;
  credentialType?: string;
  expiration?: number | string;
  uri?: string;
} & FormattedBaseSpecification;

export type FormattedCredentialAcceptSpecification = {
  issuer?: string;
  credentialType?: string;
} & FormattedBaseSpecification;

export type FormattedCredentialDeleteSpecification = {
  issuer?: string;
  subject?: string;
  credentialType?: string;
} & FormattedBaseSpecification;

export type FormattedPermissionedDomainSetSpecification = {
  acceptedCredentials?: FormattedAuthorizeCredentials[];
} & FormattedBaseSpecification;
