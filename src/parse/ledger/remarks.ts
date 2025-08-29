import { FormattedRemark, Remark } from "../../types";

import { removeUndefined } from "../../common";
import { hexToString, decodeHexData } from "../utils";
import parseRemarkFlags from "./remark-flags";

export const REMARKS_SUPPORTED_ENTRIES = [
  "AccountRoot",
  "Offer",
  "Escrow",
  "Ticket",
  "PayChannel",
  "Check",
  "DepositPreauth",
  "URIToken",
  "RippleState",
];

export function parseRemarks(remarks: Remark[]): FormattedRemark[] {
  if (!Array.isArray(remarks)) {
    return [];
  }

  return remarks.map((remark) => {
    return removeUndefined(parseRemark(remark));
  });
}

function parseRemark(remark: Remark): FormattedRemark {
  const { RemarkName, RemarkValue, Flags } = remark.Remark;

  return removeUndefined({
    name: hexToString(RemarkName),
    value: decodeHexData(RemarkValue),
    flags: parseRemarkFlags(Flags as number),
  });
}
