import { FormattedIssuedCurrencyAmount, FormattedIssuedMPTAmount } from "./amounts";
import { LockedBalanceChanges } from "../parse/outcome/locked_balance_changes";
import { BalanceChanges } from "../parse/outcome/balance_changes";

export type Outcome = {
  result?: string;
  ledgerVersion?: number;
  indexInLedger?: number;
  fee?: string;
  balanceChanges?: BalanceChanges;
  lockedBalanceChanges?: LockedBalanceChanges;
  orderbookChanges?: object;
  channelChanges?: object;
  nftokenChanges?: object;
  nftokenOfferChanges?: object;
  uritokenChanges?: object;
  uritokenSellOfferChanges?: object;
  affectedObjects?: object;
  ammChanges?: object;
  deliveredAmount?: FormattedIssuedCurrencyAmount | FormattedIssuedMPTAmount;
  timestamp?: string;
};
