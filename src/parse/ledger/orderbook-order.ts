import _ from "lodash";
import { parseTimestamp, adjustQualityForXRP } from "../utils";
import { removeUndefined } from "../../common";

import { orderFlags } from "../../types/flags";
import parseAmount from "./amount";
import {
  Amount,
  OfferLedgerEntry,
  FormattedIssuedCurrencyAmount,
  FormattedOfferCreateSpecification,
} from "../../types";

export interface BookOffer extends OfferLedgerEntry {
  quality?: string;
  owner_funds?: string;
  taker_gets_funded?: Amount;
  taker_pays_funded?: Amount;
}

export type FormattedOrderbookOrder = {
  specification: FormattedOfferCreateSpecification;
  properties: {
    maker: string;
    sequence: number;
    makerExchangeRate: string;
  };
  state?: {
    fundedAmount?: FormattedIssuedCurrencyAmount;
    priceOfFundedAmount?: FormattedIssuedCurrencyAmount;
  };
  data: BookOffer;
};

export function parseOrderbookOrder(data: BookOffer): FormattedOrderbookOrder {
  // eslint-disable-next-line no-bitwise
  const direction = (data.Flags & orderFlags.Sell) === 0 ? "buy" : "sell";
  const takerGetsAmount = parseAmount(data.TakerGets) as FormattedIssuedCurrencyAmount;
  const takerPaysAmount = parseAmount(data.TakerPays) as FormattedIssuedCurrencyAmount;
  const quantity = direction === "buy" ? takerPaysAmount : takerGetsAmount;
  const totalPrice = direction === "buy" ? takerGetsAmount : takerPaysAmount;

  // note: immediateOrCancel and fillOrKill orders cannot enter the order book
  // so we can omit those flags here
  const specification: FormattedOfferCreateSpecification = removeUndefined({
    direction: direction,
    quantity: quantity,
    totalPrice: totalPrice,
    // eslint-disable-next-line no-bitwise
    passive: (data.Flags & orderFlags.Passive) !== 0 || undefined,
    expirationTime: parseTimestamp(data.Expiration),
  });

  const properties = {
    maker: data.Account,
    sequence: data.Sequence,
    makerExchangeRate: adjustQualityForXRP(data.quality as string, takerGetsAmount.currency, takerPaysAmount.currency),
  };

  const takerGetsFunded = data.taker_gets_funded ? parseAmount(data.taker_gets_funded) : undefined;
  const takerPaysFunded = data.taker_pays_funded ? parseAmount(data.taker_pays_funded) : undefined;
  const available = removeUndefined({
    fundedAmount: takerGetsFunded as FormattedIssuedCurrencyAmount,
    priceOfFundedAmount: takerPaysFunded as FormattedIssuedCurrencyAmount,
  });
  const state = _.isEmpty(available) ? undefined : available;
  return removeUndefined({ specification, properties, state, data });
}
