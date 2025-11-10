import * as assert from "assert";
import BigNumber from "bignumber.js";
import { dropsToXrp } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseSource } from "../ledger/source";
import { FormattedFeeUpdateSpecification } from "../../types/fees";

function parseFeeUpdate(tx: any): FormattedFeeUpdateSpecification {
  assert.ok(tx.TransactionType === "SetFee");

  // BaseFee is legacy field in hex format

  let baseFeeDrops: string = "0";
  if (tx.BaseFeeDrops) {
    baseFeeDrops = tx.BaseFeeDrops;
  } else if (tx.BaseFee) {
    baseFeeDrops = new BigNumber(tx.BaseFee, 16).toString();
  }

  const baseFeeNativeCurrency = dropsToXrp(baseFeeDrops);
  const reserveBaseNativeCurrency = dropsToXrp(tx.ReserveBase || tx.ReserveBaseDrops);
  const reserveIncrementNativeCurrency = dropsToXrp(tx.ReserveIncrement || tx.ReserveIncrementDrops);

  return {
    source: parseSource(tx),
    baseFeeXRP: baseFeeNativeCurrency,
    reserveBaseXRP: reserveBaseNativeCurrency,
    reserveIncrementXRP: reserveIncrementNativeCurrency,
    baseFeeNativeCurrency,
    reserveBaseNativeCurrency,
    reserveIncrementNativeCurrency,
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  };
}

export default parseFeeUpdate;
