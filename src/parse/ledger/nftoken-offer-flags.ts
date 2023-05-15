import { NFTokenOfferFlagsKeys, NFTokenOfferFlagsKeysInterface } from "../../v1/common/types/objects/nftokens";
import { parseFlags } from "./flags";

function parseNFTOfferFlags(value: number, options: { excludeFalse?: boolean } = {}): NFTokenOfferFlagsKeysInterface {
  return parseFlags(value, NFTokenOfferFlagsKeys, options);
}
export default parseNFTOfferFlags;
