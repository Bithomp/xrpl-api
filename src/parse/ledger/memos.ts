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
      data: decodeData(m.Memo.MemoData),
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

function decodeData(data?: string): string | undefined {
  if (!data) {
    return undefined;
  }

  const decoded = hexToString(data);

  // if decoded has '�', it means that the data is not valid utf-8
  // and we should return the original data
  if (decoded && decoded.includes("�")) {
    return data;
  }

  return decoded;
}

export { parseMemos, formattedMemoToMemo };
