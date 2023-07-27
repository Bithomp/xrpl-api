import * as assert from "assert";
import { OfferCreateFlags } from "xrpl";
import { parseTimestamp } from "../utils";
import parseAmount from "../ledger/amount";
import parseMemos from "../ledger/memos";
import { removeUndefined } from "../../common";
import { FormattedOfferCreateSpecification, OfferCreateTransaction } from "../../v1/common/types/objects/index";
import { SourcePaymentAddress } from "../../v1/common/types/objects/account";

function parseOfferCreate(tx: OfferCreateTransaction): FormattedOfferCreateSpecification {
  assert.ok(tx.TransactionType === "OfferCreate");

  // tslint:disable-next-line:no-bitwise
  const direction = (tx.Flags & OfferCreateFlags.tfSell) === 0 ? "buy" : "sell";
  const takerGetsAmount = parseAmount(tx.TakerGets);
  const takerPaysAmount = parseAmount(tx.TakerPays);
  const quantity = direction === "buy" ? takerPaysAmount : takerGetsAmount;
  const totalPrice = direction === "buy" ? takerGetsAmount : takerPaysAmount;

  const source: SourcePaymentAddress = {
    address: tx.Account,
    tag: tx.SourceTag,
  };

  return removeUndefined({
    source: removeUndefined(source),
    memos: parseMemos(tx),
    // tslint:disable-next-line:object-literal-shorthand
    direction: direction,
    // tslint:disable-next-line:object-literal-shorthand
    quantity: quantity,
    // tslint:disable-next-line:object-literal-shorthand
    totalPrice: totalPrice,
    // tslint:disable-next-line:no-bitwise
    passive: (tx.Flags & OfferCreateFlags.tfPassive) !== 0 || undefined,
    // tslint:disable-next-line:no-bitwise
    immediateOrCancel: (tx.Flags & OfferCreateFlags.tfImmediateOrCancel) !== 0 || undefined,
    // tslint:disable-next-line:no-bitwise
    fillOrKill: (tx.Flags & OfferCreateFlags.tfFillOrKill) !== 0 || undefined,
    expirationTime: parseTimestamp(tx.Expiration),
  });
}

export default parseOfferCreate;
