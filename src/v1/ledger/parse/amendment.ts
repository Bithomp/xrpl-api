import { removeUndefined } from "../../common";
import parseMemos from "./memos";

function parseAmendment(tx: any) {
  return removeUndefined({
    amendment: tx.Amendment,
    memos: parseMemos(tx),
  });
}

export default parseAmendment;
