export type Memo = {
  Memo: {
    MemoData?: string;
    MemoType?: string;
    MemoFormat?: string;
  };
};

export type FormattedMemo = {
  type?: string;
  format?: string;
  data?: string;
};
