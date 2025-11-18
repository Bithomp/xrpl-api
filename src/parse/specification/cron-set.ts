import * as assert from "assert";
import { removeUndefined } from "../../common";
import { ledgerTimeToTimestamp } from "../../models/ledger";
import parseTxCronSetFlags from "../ledger/tx-cron-set-flags";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseSource } from "../ledger/source";
import { FormattedCronSetSpecification } from "../../types/cron";

function parseCronSet(tx: any): FormattedCronSetSpecification {
  assert.ok(tx.TransactionType === "CronSet");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    source: parseSource(tx),
    startTime: tx.StartTime && ledgerTimeToTimestamp(tx.StartTime),
    repeatCount: tx.RepeatCount,
    delaySeconds: tx.DelaySeconds,
    flags: parseTxCronSetFlags(tx.Flags),
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseCronSet;
