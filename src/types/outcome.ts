export type Outcome = {
  result?: string,
  ledgerVersion?: number,
  indexInLedger?: number,
  fee?: string,
  balanceChanges?: {
    [key: string]: {
      currency: string,
      counterparty?: string,
      value: string,
    }[],
  },
  lockedBalanceChanges?: {
    [key: string]: {
      currency: string,
      counterparty?: string,
      value: string,
    }[],
  },
  orderbookChanges?: object,
  channelChanges?: object,
  nftokenChanges?: object,
  nftokenOfferChanges?: object,
  uritokenChanges?: object,
  uritokenSellOfferChanges?: object,
  affectedObjects?: object,
  deliveredAmount?: {
    currency: string,
    counterparty?: string,
    value: string,
  },
  timestamp?: string,
};
