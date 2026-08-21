import * as assert from "assert";
import { removeUndefined } from "../../common";
import parseAmount from "../ledger/amount";
import { parseEmittedDetails } from "../ledger/emit_details";
import parseTxSponsorshipSetFlags from "../ledger/tx-sponsorship-set-flags";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";
import { parseAddress } from "../ledger/destination";
import { FormattedSponsorshipSetSpecification } from "../../types/sponsorship";

function parseSponsorshipSet(tx: any, nativeCurrency?: string): FormattedSponsorshipSetSpecification {
  assert.ok(tx.TransactionType === "SponsorshipSet");

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
    source: parseSource(tx),

    counterpartySponsor: parseAddress(tx, "CounterpartySponsor"),
    feeAmountDelta: parseAmount(tx.FeeAmountDelta),
    maxFee: parseAmount(tx.MaxFee),
    remainingOwnerCountDelta: tx.RemainingOwnerCountDelta,
    sponsee: parseAddress(tx, "Sponsee"),

    emittedDetails: parseEmittedDetails(tx),
    flags: parseTxSponsorshipSetFlags(tx.Flags as number, { nativeCurrency }),
    memos: parseMemos(tx),
  });
}

export default parseSponsorshipSet;
