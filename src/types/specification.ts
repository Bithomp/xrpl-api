import { FormattedSourceAddress } from "./account";
import { FormattedMemo } from "./memos";

export type FormattedBaseSpecification = {
  source?: FormattedSourceAddress;
  memos?: FormattedMemo[];
};
