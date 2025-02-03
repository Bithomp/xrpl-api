import { removeUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseAccount } from "../ledger/account";
import { FormattedSourceAddress } from "../../types/account";
import { FormattedUnrecognizedParserSpecification } from "../../types/unrecognized";

function unrecognizedParser(tx: any): FormattedUnrecognizedParserSpecification {
  const source: FormattedSourceAddress = removeUndefined({
    address: parseAccount(tx.Account),
    tag: tx.SourceTag,
  });

  return removeUndefined({
    UNAVAILABLE: "Unrecognized transaction type.",
    SEE_RAW_TRANSACTION: "Since this type is unrecognized, `rawTransaction` is may included in this response.",
    source: Object.keys(source).length > 0 ? source : undefined,
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default unrecognizedParser;
