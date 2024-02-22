import { NFTokenOfferFlagsKeys, NFTokenOfferFlagsKeysInterface } from "../../types/nftokens";
import { parseFlags } from "./flags";

function parseNFTOfferFlags(value: number, options: { excludeFalse?: boolean } = {}): NFTokenOfferFlagsKeysInterface {
  return parseFlags(value, NFTokenOfferFlagsKeys, options);
}
export default parseNFTOfferFlags;
