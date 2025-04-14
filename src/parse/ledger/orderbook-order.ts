import _ from "lodash";
import { LedgerEntry } from "xrpl";
import { parseTimestamp, adjustQualityForXRP } from "../utils";
import { removeUndefined } from "../../common";
import parseAmount from "./amount";
import parseOfferFlags from "../ledger/offer-flags";
import {
  Amount,
  OfferLedgerEntry,
  IssuedCurrencyAmount,
  FormattedOfferCreateSpecification,
  OfferCreateFlagsKeysInterface,
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
    fundedAmount?: IssuedCurrencyAmount;
    priceOfFundedAmount?: IssuedCurrencyAmount;
  };
  data: BookOffer;
};

export function parseOrderbookOrder(data: BookOffer): FormattedOrderbookOrder {
  const flags = parseOfferFlags(data.Flags);
  const takerGets = parseAmount(data.TakerGets) as IssuedCurrencyAmount;
  const takerPays = parseAmount(data.TakerPays) as IssuedCurrencyAmount;
  const quantity = flags.sell === true ? takerGets : takerPays;
  const totalPrice = flags.sell === true ? takerPays : takerGets;

  // note: immediateOrCancel and fillOrKill orders cannot enter the order book
  // so we can omit those flags here
  const specification: FormattedOfferCreateSpecification = removeUndefined({
    flags: flags as OfferCreateFlagsKeysInterface,
    quantity: quantity,
    totalPrice: totalPrice,
    expirationTime: parseTimestamp(data.Expiration),

    /* eslint-disable no-bitwise */
    direction: (data.Flags & LedgerEntry.OfferFlags.lsfSell) === 0 ? "buy" : "sell", // @deprecated
    passive: (data.Flags & LedgerEntry.OfferFlags.lsfPassive) !== 0 || undefined,
    /* eslint-enable no-bitwise */
  });

  const properties = {
    maker: data.Account,
    sequence: data.Sequence,
    makerExchangeRate: adjustQualityForXRP(data.quality as string, takerGets.currency, takerPays.currency),
  };

  const takerGetsFunded = data.taker_gets_funded ? parseAmount(data.taker_gets_funded) : undefined;
  const takerPaysFunded = data.taker_pays_funded ? parseAmount(data.taker_pays_funded) : undefined;
  const available = removeUndefined({
    fundedAmount: takerGetsFunded as IssuedCurrencyAmount,
    priceOfFundedAmount: takerPaysFunded as IssuedCurrencyAmount,
  });
  const state = _.isEmpty(available) ? undefined : available;
  return removeUndefined({ specification, properties, state, data });
}
