import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseMemos from "../ledger/memos";
import { FormattedAccountDeleteSpecification } from "../../v1/common/types/objects/account";
import { SourcePaymentAddress, DestinationPaymentAddress } from "../../v1/common/types/objects/account";

function parseAccountDelete(tx: any): FormattedAccountDeleteSpecification {
  assert.ok(tx.TransactionType === "AccountDelete");

  const source: SourcePaymentAddress = {
    address: tx.Account,
    tag: tx.SourceTag,
  };

  const destination: DestinationPaymentAddress = {
    address: tx.Destination,
    tag: tx.DestinationTag,
  };

  return removeUndefined({
    source: removeUndefined(source),
    destination: removeUndefined(destination),
    memos: parseMemos(tx),
  });
}

export default parseAccountDelete;
