import { removeUndefined } from "../../v1/common";
import parseMemos from "../ledger/memos";
import { FormattedAmendmentSpecification } from "../../v1/common/types/objects/amendments";

function parseAmendment(tx: any): FormattedAmendmentSpecification {
  return removeUndefined({
    amendment: tx.Amendment,
    memos: parseMemos(tx),
  });
}

export default parseAmendment;
