import { FormattedMemo, Memo } from "../../types";
import { removeUndefined } from "../../common";
import { hexToString, stringToHex } from "../utils";

function parseMemos(tx: any): FormattedMemo[] | undefined {
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

function formattedMemoToMemo(memo: FormattedMemo): Memo {
  return {
    Memo: removeUndefined({
      MemoData: stringToHex(memo.data),
      MemoType: stringToHex(memo.type),
      MemoFormat: stringToHex(memo.format),
    }),
  };
}

export { parseMemos, formattedMemoToMemo };
