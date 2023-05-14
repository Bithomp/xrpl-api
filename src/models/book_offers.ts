import _ from "lodash";
import BigNumber from "bignumber.js";
import { parseOrderbookOrder } from "../v1/ledger/parse/orderbook-order";
import { Issue } from "../v1/common/types/objects/amounts";

export type OrderbookInfo = {
  base: Issue;
  counter: Issue;
};

function isSameIssue(a: Issue, b: Issue) {
  return a.currency === b.currency && a.counterparty === b.counterparty;
}

function directionFilter(direction: string, order: any) {
  return order.specification.direction === direction;
}

function flipOrder(order: any) {
  const specification = order.specification;
  const flippedSpecification = {
    quantity: specification.totalPrice,
    totalPrice: specification.quantity,
    direction: specification.direction === "buy" ? "sell" : "buy",
  };
  const newSpecification = _.merge({}, specification, flippedSpecification);
  return _.merge({}, order, { specification: newSpecification });
}

function alignOrder(base: Issue, order: any) {
  const quantity = order.specification.quantity;
  return isSameIssue(quantity, base) ? order : flipOrder(order);
}

export function formatBidsAndAsks(orderbook: OrderbookInfo, offers: any[]) {
  // the "base" currency is the currency that you are buying or selling
  // the "counter" is the currency that the "base" is priced in
  // a "bid"/"ask" is an order to buy/sell the base, respectively
  // for bids: takerGets = totalPrice = counter, takerPays = quantity = base
  // for asks: takerGets = quantity = base, takerPays = totalPrice = counter
  // quality = takerPays / takerGets; price = totalPrice / quantity
  // for bids: lowest quality => lowest quantity/totalPrice => highest price
  // for asks: lowest quality => lowest totalPrice/quantity => lowest price
  // for both bids and asks, lowest quality is closest to mid-market
  // we sort the orders so that earlier orders are closer to mid-market
  const orders = offers
    .sort((a, b) => {
      return new BigNumber(a.quality).comparedTo(b.quality);
    })
    .map(parseOrderbookOrder);

  const alignedOrders = orders.map(_.partial(alignOrder, orderbook.base));
  const bids = alignedOrders.filter(_.partial(directionFilter, "buy"));
  const asks = alignedOrders.filter(_.partial(directionFilter, "sell"));

  return { bids, asks };
}
