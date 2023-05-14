import * as assert from "assert";
import { removeUndefined } from "../../common";
import { classicAddressToXAddress } from "ripple-address-codec";
import parseMemos from "./memos";

import { FormattedAccountDeleteSpecification } from "../../common/types/objects/account";

function parseAccountDelete(tx: any): FormattedAccountDeleteSpecification {
  assert.ok(tx.TransactionType === "AccountDelete");

  return removeUndefined({
    memos: parseMemos(tx),
    destination: tx.Destination,
    destinationTag: tx.DestinationTag,
    destinationXAddress: classicAddressToXAddress(
      tx.Destination,
      tx.DestinationTag == null ? false : tx.DestinationTag,
      false
    ),
  });
}

export default parseAccountDelete;
