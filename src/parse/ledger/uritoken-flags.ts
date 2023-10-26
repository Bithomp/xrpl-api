import { URITokenFlagsKeys, URITokenFlagsKeysInterface } from "../../v1/common/types/objects/uritokens";
import { parseFlags } from "./flags";

function parseURITokenFlags(value: number, options: { excludeFalse?: boolean } = {}): URITokenFlagsKeysInterface {
  return parseFlags(value, URITokenFlagsKeys, options);
}

export default parseURITokenFlags;
