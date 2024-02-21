import * as assert from "assert";
import { TrustSetFlags } from "xrpl";
import { parseQuality } from "../utils";
import { removeUndefined } from "../../common";
import { parseMemos } from "../ledger/memos";

import { FormattedTrustlineSpecification } from "../../v1/common/types/objects/trustlines";

function parseFlag(flagsValue, trueValue, falseValue) {
  // eslint-disable-next-line no-bitwise
  if (flagsValue & trueValue) {
    return true;
  }
  // eslint-disable-next-line no-bitwise
  if (flagsValue & falseValue) {
    return false;
  }
  return undefined;
}

function parseTrustline(tx: any): FormattedTrustlineSpecification {
  assert.ok(tx.TransactionType === "TrustSet");

  return removeUndefined({
    limit: tx.LimitAmount.value,
    currency: tx.LimitAmount.currency,
    counterparty: tx.LimitAmount.issuer,
    memos: parseMemos(tx),
    qualityIn: parseQuality(tx.QualityIn),
    qualityOut: parseQuality(tx.QualityOut),
    ripplingDisabled: parseFlag(tx.Flags, TrustSetFlags.tfSetNoRipple, TrustSetFlags.tfClearNoRipple),
    frozen: parseFlag(tx.Flags, TrustSetFlags.tfSetFreeze, TrustSetFlags.tfClearFreeze),
    authorized: parseFlag(tx.Flags, TrustSetFlags.tfSetfAuth, 0),
  });
}

export default parseTrustline;
