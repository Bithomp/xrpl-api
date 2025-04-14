import * as assert from "assert";
import { OfferCreateFlags } from "xrpl";
import { parseTimestamp } from "../utils";
import parseAmount from "../ledger/amount";
import { parseMemos } from "../ledger/memos";
import { parseEmittedDetails } from "../ledger/emit_details";
import { removeUndefined } from "../../common";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseSource } from "../ledger/source";
import parseOfferCreateFlags from "../ledger/offer-create-flags";
import { FormattedOfferCreateSpecification, OfferCreateTransaction, IssuedCurrencyAmount } from "../../types";

function parseOfferCreate(tx: OfferCreateTransaction): FormattedOfferCreateSpecification {
  assert.ok(tx.TransactionType === "OfferCreate");
  const flags = parseOfferCreateFlags(tx.Flags);
  const takerGets = parseAmount(tx.TakerGets) as IssuedCurrencyAmount;
  const takerPays = parseAmount(tx.TakerPays) as IssuedCurrencyAmount;
  const quantity = flags.sell === true ? takerGets : takerPays;
  const totalPrice = flags.sell === true ? takerPays : takerGets;

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    source: parseSource(tx),
    flags,
    quantity: quantity,
    totalPrice: totalPrice,

    /* eslint-disable no-bitwise */
    direction: (tx.Flags & OfferCreateFlags.tfSell) === 0 ? "buy" : "sell", // @deprecated
    passive: (tx.Flags & OfferCreateFlags.tfPassive) !== 0 || undefined, // @deprecated
    immediateOrCancel: (tx.Flags & OfferCreateFlags.tfImmediateOrCancel) !== 0 || undefined, // @deprecated
    fillOrKill: (tx.Flags & OfferCreateFlags.tfFillOrKill) !== 0 || undefined, // @deprecated
    /* eslint-enable no-bitwise */

    expirationTime: parseTimestamp(tx.Expiration),
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseOfferCreate;
