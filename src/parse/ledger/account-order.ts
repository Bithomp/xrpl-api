import BigNumber from "bignumber.js";
import { LedgerEntry } from "xrpl";
import parseAmount from "./amount";
import { parseTimestamp, adjustQualityForXRP } from "../utils";
import { removeUndefined } from "../../common";
import parseOfferFlags from "../ledger/offer-flags";
import { FormattedOfferCreateSpecification, FormattedIssuedCurrencyAmount, OfferCreateFlagsKeysInterface } from "../../types";

export type FormattedAccountOrders = {
  /** Unique Address identifying the account that made the offers. */
  account: string;
  /**
   * Array of objects, where each object represents an offer made by this
   * account that is outstanding as of the requested ledger version. If the
   * number of offers is large, only returns up to limit at a time.
   */
  offers?: FormattedAccountOrder[];
  /**
   * The ledger index of the current in-progress ledger version, which was
   * used when retrieving this data.
   */
  ledger_current_index?: number;
  /**
   * The ledger index of the ledger version that was used when retrieving
   * this data, as requested.
   */
  ledger_index?: number;
  /**
   * The identifying hash of the ledger version that was used when retrieving
   * this data.
   */
  ledger_hash?: string;
  /**
   * Server-defined value indicating the response is paginated. Pass this to
   * the next call to resume where this call left off. Omitted when there are
   * no pages of information after this one.
   */
  marker?: unknown;
};

export type FormattedAccountOrder = {
  specification: FormattedOfferCreateSpecification;
  properties: {
    maker: string;
    sequence: number;
    makerExchangeRate: string;
  };
};

// TODO: remove this function once rippled provides quality directly
function computeQuality(takerGets, takerPays) {
  const quotient = new BigNumber(takerPays.value).dividedBy(takerGets.value);
  return quotient.precision(16, BigNumber.ROUND_HALF_UP).toString();
}

// rippled 'account_offers' returns a different format for orders than 'tx'
// the flags are also different
export function parseAccountOrder(address: string, order: any): FormattedAccountOrder {
  const flags = parseOfferFlags(order.flags);
  const takerGetsAmount = parseAmount(order.taker_gets) as FormattedIssuedCurrencyAmount;
  const takerPaysAmount = parseAmount(order.taker_pays) as FormattedIssuedCurrencyAmount;
  const quantity = flags.sell === true ? takerGetsAmount : takerPaysAmount;
  const totalPrice = flags.sell === true ? takerPaysAmount : takerGetsAmount;

  // note: immediateOrCancel and fillOrKill orders cannot enter the order book
  // so we can omit those flags here
  const specification = removeUndefined({
    flags: flags as OfferCreateFlagsKeysInterface,
    quantity: quantity,
    totalPrice: totalPrice,
    expirationTime: parseTimestamp(order.expiration),

    /* eslint-disable no-bitwise */
    direction: (order.flags & LedgerEntry.OfferFlags.lsfSell) === 0 ? "buy" : "sell", // @deprecated
    passive: (order.flags & LedgerEntry.OfferFlags.lsfPassive) !== 0 || undefined, // @deprecated
    /* eslint-enable no-bitwise */
  });

  /* eslint-disable multiline-ternary */
  const makerExchangeRate = order.quality
    ? adjustQualityForXRP(order.quality.toString(), takerGetsAmount.currency, takerPaysAmount.currency)
    : computeQuality(takerGetsAmount, takerPaysAmount);
  /* eslint-enable multiline-ternary */
  const properties = {
    maker: address,
    sequence: order.seq,
    makerExchangeRate: makerExchangeRate,
  };

  return { specification, properties };
}
