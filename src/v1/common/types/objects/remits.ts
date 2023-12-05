import { FormattedBaseSpecification } from "./specification";
import { FormattedDestinationAddress, FormattedSourceAddress } from "./account";
import { Amount } from "../../../../types";
import { URITokenFlagsKeysInterface } from "./uritokens";

export type FormattedRemitsSpecification = {
  source: FormattedSourceAddress;
  destination: FormattedDestinationAddress;
  amounts?: Amount[];
  uritokenIDs?: string[];
  uritokenMint?: {
    uri: string;
    flags?: URITokenFlagsKeysInterface;
    digest?: string;
  };
  blob?: string;
  inform?: string;
  invoiceID?: string;
} & FormattedBaseSpecification;
