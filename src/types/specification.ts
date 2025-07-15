import { FormattedSourceAddress, FormattedSignerRegularKey } from "./account";
import { FormattedEmitDetails } from "./emit_details";
import { FormattedMemo } from "./memos";
import { FormattedTransactionSigner } from "./signers";

export type FormattedBaseSpecification = {
  source?: FormattedSourceAddress;
  signers?: FormattedTransactionSigner[];
  signer?: FormattedSignerRegularKey;
  delegate?: FormattedSignerRegularKey;
  emittedDetails?: FormattedEmitDetails;
  memos?: FormattedMemo[];
};
