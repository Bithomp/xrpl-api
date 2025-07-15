import { removeUndefined } from "../../common";
import { FormattedSignerRegularKey } from "../../types/account";

// {
//   "Delegate": "rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv",
// }
export function parseDelegate(tx: any): FormattedSignerRegularKey | undefined {
  if (tx && tx.Delegate) {
    return removeUndefined({
      address: tx.Delegate,
    });
  }
}
