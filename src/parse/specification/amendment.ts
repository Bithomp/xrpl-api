import { removeUndefined } from "../../v1/common";
import parseMemos from "../ledger/memos";

function parseAmendment(tx: any) {
  return removeUndefined({
    amendment: tx.Amendment,
    memos: parseMemos(tx),
  });
}

export default parseAmendment;
