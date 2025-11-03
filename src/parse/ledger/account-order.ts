import BigNumber from "bignumber.js";
import { LedgerEntry } from "xrpl";
import parseAmount from "./amount";
import { parseTimestamp, adjustQualityForXRP } from "../utils";
import { removeUndefined } from "../../common";
import parseOfferFlags from "../ledger/offer-flags";
import { FormattedOfferCreateSpecification, IssuedCurrencyAmount, OfferCreateFlagsKeysInterface } from "../../types";

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
  const takerGets = parseAmount(order.taker_gets) as IssuedCurrencyAmount;
  const takerPays = parseAmount(order.taker_pays) as IssuedCurrencyAmount;
  const quantity = flags.sell === true ? takerGets : takerPays;
  const totalPrice = flags.sell === true ? takerPays : takerGets;

  // note: immediateOrCancel and fillOrKill orders cannot enter the order book
  // so we can omit those flags here
  const specification = removeUndefined({
    flags: flags as OfferCreateFlagsKeysInterface,
    expirationTime: parseTimestamp(order.expiration),
    takerGets: takerGets,
    takerPays: takerPays,

    /* eslint-disable no-bitwise */
    direction: (order.flags & LedgerEntry.OfferFlags.lsfSell) === 0 ? "buy" : "sell", // @deprecated
    passive: (order.flags & LedgerEntry.OfferFlags.lsfPassive) !== 0 || undefined, // @deprecated
    quantity: quantity, // @deprecated, use takerGets instead
    totalPrice: totalPrice, // @deprecated, use takerPays instead
    /* eslint-enable no-bitwise */
  });

  let makerExchangeRate: string;

  if (order.quality) {
    const takerGetsCurrency = takerGets.issuer ? null : takerGets.currency; // null or XRP, prevent confusion with issued currency "XRP" - FakeXRP
    const takerPaysCurrency = takerPays.issuer ? null : takerPays.currency; // null or XRP, prevent confusion with issued currency "XRP" - FakeXRP

    makerExchangeRate = adjustQualityForXRP(order.quality.toString(), takerGetsCurrency, takerPaysCurrency);
  } else {
    makerExchangeRate = computeQuality(takerGets, takerPays);
  }

  const properties = {
    maker: address,
    sequence: order.seq,
    makerExchangeRate: makerExchangeRate,
  };

  return { specification, properties };
}
