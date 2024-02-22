import BigNumber from "bignumber.js";
import { dropsToXrp } from "../../common";
import { parseMemos } from "../ledger/memos";
import { FormattedFeeUpdateSpecification } from "../../types/fees";

function parseFeeUpdate(tx: any): FormattedFeeUpdateSpecification {
  const baseFeeDrops = new BigNumber(tx.BaseFee, 16).toString();
  return {
    memos: parseMemos(tx),
    baseFeeXRP: dropsToXrp(baseFeeDrops),
    referenceFeeUnits: tx.ReferenceFeeUnits,
    reserveBaseXRP: dropsToXrp(tx.ReserveBase),
    reserveIncrementXRP: dropsToXrp(tx.ReserveIncrement),
  };
}

export default parseFeeUpdate;
