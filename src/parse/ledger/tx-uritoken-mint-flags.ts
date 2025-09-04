import { getURITokenMintFlagsKeys, URITokenFlagsKeysInterface } from "../../types/uritokens";
import { parseFlags } from "./flags";

function parseTxURITokenMintFlags(
  value: number,
  options: { excludeFalse?: boolean; nativeCurrency?: string } = {}
): URITokenFlagsKeysInterface {
  return parseFlags(value, getURITokenMintFlagsKeys(options.nativeCurrency), options);
}

export default parseTxURITokenMintFlags;
