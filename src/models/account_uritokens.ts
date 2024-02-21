// NOTE: URI Tokens is not part of mainnet, this code can be changed in the future without notice

import { Amount } from "../types";

export interface URITokenInterface {
  Digest?: string;
  Flags: number;
  Issuer: string;
  Owner: string;
  URITokenID: string;
  URI: string;
  Amount?: Amount;
  Destination?: string;
}
