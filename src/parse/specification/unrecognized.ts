import { removeUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseSource } from "../ledger/source";
import { FormattedUnrecognizedParserSpecification } from "../../types/unrecognized";

function unrecognizedParser(tx: any): FormattedUnrecognizedParserSpecification {
  return removeUndefined({
    UNAVAILABLE: "Unrecognized transaction type.",
    SEE_RAW_TRANSACTION: "Since this type is unrecognized, `rawTransaction` is may included in this response.",
    source: parseSource(tx),
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default unrecognizedParser;
