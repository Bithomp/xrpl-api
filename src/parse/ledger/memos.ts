import { FormattedMemo, Memo } from "../../v1/common/types/objects";
import { removeUndefined } from "../../common";
import { hexToString } from "../utils";

// tslint:disable-next-line:array-type
function parseMemos(tx: any): Array<FormattedMemo> | undefined {
  if (!Array.isArray(tx.Memos) || tx.Memos.length === 0) {
    return undefined;
  }
  return tx.Memos.map((m: Memo) => {
    return removeUndefined({
      type: hexToString(m.Memo.MemoType),
      format: hexToString(m.Memo.MemoFormat),
      data: hexToString(m.Memo.MemoData),
    });
  });
}

export default parseMemos;
