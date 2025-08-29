import { CredentialFlagsKeys, CredentialFlagsKeysInterface } from "../../types/credentials";
import { parseFlags } from "./flags";

function parseCredentialFlags(value: number, options: { excludeFalse?: boolean } = {}): CredentialFlagsKeysInterface {
  return parseFlags(value, CredentialFlagsKeys, options);
}

export default parseCredentialFlags;
