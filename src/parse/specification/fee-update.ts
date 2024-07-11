import BigNumber from "bignumber.js";
import { dropsToXrp } from "../../common";
import { parseEmitDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { FormattedFeeUpdateSpecification } from "../../types/fees";

function parseFeeUpdate(tx: any): FormattedFeeUpdateSpecification {
  const baseFeeDrops = new BigNumber(tx.BaseFee, 16).toString();
  return {
    baseFeeXRP: dropsToXrp(baseFeeDrops),
    referenceFeeUnits: tx.ReferenceFeeUnits,
    reserveBaseXRP: dropsToXrp(tx.ReserveBase),
    reserveIncrementXRP: dropsToXrp(tx.ReserveIncrement),
    emitDetails: parseEmitDetails(tx),
    memos: parseMemos(tx),
  };
}

export default parseFeeUpdate;
