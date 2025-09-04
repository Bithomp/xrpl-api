import { getNFTokenOfferCreateFlagsKeys, NFTokenOfferFlagsKeysInterface } from "../../types/nftokens";
import { parseFlags } from "./flags";

function parseTxNFTOfferCreateFlags(
  value: number,
  options: { excludeFalse?: boolean; nativeCurrency?: string } = {}
): NFTokenOfferFlagsKeysInterface {
  return parseFlags(value, getNFTokenOfferCreateFlagsKeys(options.nativeCurrency), options);
}
export default parseTxNFTOfferCreateFlags;
