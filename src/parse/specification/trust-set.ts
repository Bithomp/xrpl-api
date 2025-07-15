import * as assert from "assert";
import { TrustSetFlags, TrustSet } from "xrpl";
import { parseQuality } from "../utils";
import { removeUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";
import { FormattedTrustlineSpecification } from "../../types/trustlines";

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

function parseTrustSet(tx: TrustSet): FormattedTrustlineSpecification {
  assert.ok(tx.TransactionType === "TrustSet");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
    source: parseSource(tx),
    limit: tx.LimitAmount.value,
    currency: tx.LimitAmount.currency,
    counterparty: tx.LimitAmount.issuer,
    qualityIn: parseQuality(tx.QualityIn),
    qualityOut: parseQuality(tx.QualityOut),
    ripplingDisabled: parseFlag(tx.Flags, TrustSetFlags.tfSetNoRipple, TrustSetFlags.tfClearNoRipple),
    frozen: parseFlag(tx.Flags, TrustSetFlags.tfSetFreeze, TrustSetFlags.tfClearFreeze),
    authorized: parseFlag(tx.Flags, TrustSetFlags.tfSetfAuth, 0),
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseTrustSet;
