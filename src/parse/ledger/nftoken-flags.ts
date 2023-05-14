import { NFTokenFlagsKeys, NFTokenFlagsKeysInterface } from "../../v1/common/types/objects/nftokens";
import { parseFlags } from "./flags";

function parseNFTokenFlags(value: number, options: { excludeFalse?: boolean } = {}): NFTokenFlagsKeysInterface {
  return parseFlags(value, NFTokenFlagsKeys, options);
}

export default parseNFTokenFlags;
