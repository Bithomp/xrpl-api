import * as assert from "assert";
import { OfferCreateFlags } from "xrpl";
import { parseTimestamp } from "../utils";
import parseAmount from "../ledger/amount";
import { parseEmittedDetails } from "../ledger/emit_details";
import { parseMemos } from "../ledger/memos";
import { removeUndefined } from "../../common";
import { FormattedSourceAddress } from "../../types/account";
import { FormattedOfferCreateSpecification, OfferCreateTransaction, FormattedIssuedCurrencyAmount } from "../../types";

function parseOfferCreate(tx: OfferCreateTransaction): FormattedOfferCreateSpecification {
  assert.ok(tx.TransactionType === "OfferCreate");
  // eslint-disable-next-line no-bitwise
  const direction = (tx.Flags & OfferCreateFlags.tfSell) === 0 ? "buy" : "sell";
  const takerGetsAmount = parseAmount(tx.TakerGets) as FormattedIssuedCurrencyAmount;
  const takerPaysAmount = parseAmount(tx.TakerPays) as FormattedIssuedCurrencyAmount;
  const quantity = direction === "buy" ? takerPaysAmount : takerGetsAmount;
  const totalPrice = direction === "buy" ? takerGetsAmount : takerPaysAmount;

  const source: FormattedSourceAddress = {
    address: tx.Account,
    tag: tx.SourceTag,
  };

  return removeUndefined({
    source: Object.keys(source).length > 0 ? source : undefined,
    direction: direction,
    quantity: quantity,
    totalPrice: totalPrice,
    // eslint-disable-next-line no-bitwise
    passive: (tx.Flags & OfferCreateFlags.tfPassive) !== 0 || undefined,
    // eslint-disable-next-line no-bitwise
    immediateOrCancel: (tx.Flags & OfferCreateFlags.tfImmediateOrCancel) !== 0 || undefined,
    // eslint-disable-next-line no-bitwise
    fillOrKill: (tx.Flags & OfferCreateFlags.tfFillOrKill) !== 0 || undefined,
    expirationTime: parseTimestamp(tx.Expiration),
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseOfferCreate;
