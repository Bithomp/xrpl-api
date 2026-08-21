import { getSponsorshipSetFlagsKeys, SponsorshipSetFlagsKeysInterface } from "../../types/sponsorship";
import { parseFlags } from "./flags";

function parseTxSponsorshipSetFlags(
  value: number,
  options: { excludeFalse?: boolean; nativeCurrency?: string } = {}
): SponsorshipSetFlagsKeysInterface {
  return parseFlags(value, getSponsorshipSetFlagsKeys(options.nativeCurrency), options);
}

export default parseTxSponsorshipSetFlags;
