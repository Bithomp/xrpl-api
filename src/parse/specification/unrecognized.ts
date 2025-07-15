import { BaseTransaction } from "xrpl";
import { removeUndefined } from "../../common";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";
import { FormattedUnrecognizedParserSpecification } from "../../types/unrecognized";

function unrecognizedParser(tx: BaseTransaction): FormattedUnrecognizedParserSpecification {
  return removeUndefined({
    UNAVAILABLE: "Unrecognized transaction type.",
    SEE_RAW_TRANSACTION: "Since this type is unrecognized, `rawTransaction` is may included in this response.",
    source: parseSource(tx),
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default unrecognizedParser;
