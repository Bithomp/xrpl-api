import BigNumber from "bignumber.js";
import { dropsToXrp } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseTxGlobalFlags } from "../ledger/tx-global-flags";
import { parseMemos } from "../ledger/memos";
import { parseSource } from "../ledger/source";
import { FormattedFeeUpdateSpecification } from "../../types/fees";

function parseFeeUpdate(tx: any, nativeCurrency?: string): FormattedFeeUpdateSpecification {
  const baseFeeDrops = new BigNumber(tx.BaseFee, 16).toString();
  return {
    source: parseSource(tx),
    baseFeeXRP: dropsToXrp(baseFeeDrops),
    referenceFeeUnits: tx.ReferenceFeeUnits,
    reserveBaseXRP: dropsToXrp(tx.ReserveBase),
    reserveIncrementXRP: dropsToXrp(tx.ReserveIncrement),
    emittedDetails: parseEmittedDetails(tx),
    flags: parseTxGlobalFlags(tx.Flags as number, { nativeCurrency }),
    memos: parseMemos(tx),
  };
}

export default parseFeeUpdate;
