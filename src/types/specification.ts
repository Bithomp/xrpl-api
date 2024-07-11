import { FormattedSourceAddress } from "./account";
import { FormattedEmitDetails } from "./emit_details";
import { FormattedMemo } from "./memos";

export type FormattedBaseSpecification = {
  source?: FormattedSourceAddress;
  emitDetails?: FormattedEmitDetails;
  memos?: FormattedMemo[];
};
