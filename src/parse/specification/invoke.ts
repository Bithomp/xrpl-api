import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseEmitDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";

import { FormattedSourceAddress, FormattedDestinationAddress } from "../../types/account";
import { FormattedInvokeSpecification } from "../../types/invoke";

function parseInvoke(tx: any): FormattedInvokeSpecification {
  assert.ok(tx.TransactionType === "Invoke");

  const source: FormattedSourceAddress = {
    address: tx.Account,
    tag: tx.SourceTag,
  };

  const destination: FormattedDestinationAddress = {
    address: tx.Destination,
  };

  return {
    source: removeUndefined(source),
    destination: removeUndefined(destination),
    emitDetails: parseEmitDetails(tx),
    memos: parseMemos(tx),
  };
}

export default parseInvoke;
