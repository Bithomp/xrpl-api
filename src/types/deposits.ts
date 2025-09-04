import { FormattedBaseSpecification } from "./specification";

export interface FormattedAuthorizeCredentials {
  issuer?: string;
  type?: string;
}

export type FormattedDepositPreauthSpecification = {
  // account (address) of the sender to preauthorize
  authorize?: string;

  // account (address) of the sender whose preauthorization should be revoked
  unauthorize?: string;

  authorizeCredentials?: FormattedAuthorizeCredentials[];
  unauthorizeCredentials?: FormattedAuthorizeCredentials[];
} & FormattedBaseSpecification;
