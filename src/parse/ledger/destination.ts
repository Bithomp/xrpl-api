import { removeUndefined } from "../../common";
import { FormattedDestinationAddress } from "../../types/account";

// {
//   "Destination": "rDsbeomae4FXwgQTJp9Rs64Qg9vDiTCdBv",
//   "DestinationTag": 999,
// }
export function parseDestination(tx: any): FormattedDestinationAddress | undefined {
  if (tx && tx.Destination) {
    return removeUndefined({
      address: tx.Destination,
      tag: tx.DestinationTag,
    });
  }
}
