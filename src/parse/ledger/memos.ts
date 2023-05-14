import { Memo } from "../../v1/common/types/objects";
import { removeUndefined } from "../../v1/common";
import { hexToString } from "../utils";

// tslint:disable-next-line:array-type
function parseMemos(tx: any): Array<Memo> | undefined {
  if (!Array.isArray(tx.Memos) || tx.Memos.length === 0) {
    return undefined;
  }
  return tx.Memos.map((m: any) => {
    return removeUndefined({
      type: m.Memo.parsed_memo_type || hexToString(m.Memo.MemoType),
      format: m.Memo.parsed_memo_format || hexToString(m.Memo.MemoFormat),
      data: m.Memo.parsed_memo_data || hexToString(m.Memo.MemoData),
    });
  });
}

export default parseMemos;
