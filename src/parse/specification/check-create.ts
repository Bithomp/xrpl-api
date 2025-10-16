import * as assert from "assert";
import { CheckCreate } from "xrpl";
import { removeUndefined, emptyObjectToUndefined } from "../../common";
import { parseTimestamp } from "../utils";
import parseAmount from "../ledger/amount";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseTxGlobalFlags } from "../ledger/tx-global-flags";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";
import { parseDestination } from "../ledger/destination";
import { FormattedCheckCreateSpecification } from "../../types/checks";

function parseCheckCreate(tx: CheckCreate, nativeCurrency?: string): FormattedCheckCreateSpecification {
  assert.ok(tx.TransactionType === "CheckCreate");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
    source: parseSource(tx),
    destination: parseDestination(tx),
    sendMax: parseAmount(tx.SendMax),
    expiration: tx.Expiration && parseTimestamp(tx.Expiration),
    invoiceID: tx.InvoiceID,
    emittedDetails: parseEmittedDetails(tx),
    flags: emptyObjectToUndefined(parseTxGlobalFlags(tx.Flags as number, { nativeCurrency })),
    memos: parseMemos(tx),
  });
}

export default parseCheckCreate;
