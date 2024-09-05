import { AccountInfoResponse } from "../../models/account_info";
import { removeUndefined, dropsToXrp } from "../../common";
import { FormattedAccountInfoData } from "../../types";

export function parseAccountInfoData(response: AccountInfoResponse): FormattedAccountInfoData {
  const data = response.account_data;
  return removeUndefined({
    sequence: data.Sequence,
    xrpBalance: dropsToXrp(data.Balance),
    ownerCount: data.OwnerCount,
    previousInitiatedTransactionID: data.AccountTxnID,
    previousAffectingTransactionID: data.PreviousTxnID,
    previousAffectingTransactionLedgerVersion: data.PreviousTxnLgrSeq,
  });
}
