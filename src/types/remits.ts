import { FormattedBaseSpecification } from "./specification";
import { Amount } from "./amounts";
import { URITokenFlagsKeysInterface } from "./uritokens";

export type FormattedRemitsSpecification = {
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
