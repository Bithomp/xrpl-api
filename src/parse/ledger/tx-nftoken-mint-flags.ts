import { getNFTokenMintFlagsKeys, NFTokenFlagsKeysInterface } from "../../types/nftokens";
import { parseFlags } from "./flags";

function parseTxNFTokenMintFlags(
  value: number,
  options: { excludeFalse?: boolean; nativeCurrency?: string } = {}
): NFTokenFlagsKeysInterface {
  return parseFlags(value, getNFTokenMintFlagsKeys(options.nativeCurrency), options);
}

export default parseTxNFTokenMintFlags;
