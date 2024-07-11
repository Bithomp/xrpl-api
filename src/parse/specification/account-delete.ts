import * as assert from "assert";
import { removeUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseAccount } from "../ledger/account";
import {
  FormattedSourceAddress,
  FormattedDestinationAddress,
  FormattedAccountDeleteSpecification,
} from "../../types/account";

function parseAccountDelete(tx: any): FormattedAccountDeleteSpecification {
  assert.ok(tx.TransactionType === "AccountDelete");

  const source: FormattedSourceAddress = removeUndefined({
    address: parseAccount(tx.Account),
    tag: tx.SourceTag,
  });

  const destination: FormattedDestinationAddress = removeUndefined({
    address: tx.Destination,
    tag: tx.DestinationTag,
  });

  return removeUndefined({
    source: Object.keys(source).length > 0 ? source : undefined,
    destination: Object.keys(destination).length > 0 ? destination : undefined,
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseAccountDelete;
