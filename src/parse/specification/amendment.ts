import { removeUndefined } from "../../common";
import { parseMemos } from "../ledger/memos";
import { FormattedAmendmentSpecification } from "../../types/objects/amendments";

function parseAmendment(tx: any): FormattedAmendmentSpecification {
  return removeUndefined({
    amendment: tx.Amendment,
    memos: parseMemos(tx),
  });
}

export default parseAmendment;
