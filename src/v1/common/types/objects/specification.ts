import { FormattedMemo } from "./memos";
import { SourcePaymentAddress } from "./account";

export type FormattedBaseSpecification = {
  source?: SourcePaymentAddress;
  memos?: FormattedMemo[];
};
