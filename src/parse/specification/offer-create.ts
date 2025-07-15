import * as assert from "assert";
import { OfferCreateFlags, OfferCreate } from "xrpl";
import { parseTimestamp } from "../utils";
import parseAmount from "../ledger/amount";
import { parseMemos } from "../ledger/memos";
import { parseEmittedDetails } from "../ledger/emit_details";
import { removeUndefined } from "../../common";
import { parseSigners } from "../ledger/signers";
import { parseSignerRegularKey } from "../ledger/regular-key";
import { parseDelegate } from "../ledger/delegate";
import { parseSource } from "../ledger/source";
import parseOfferCreateFlags from "../ledger/offer-create-flags";
import { FormattedOfferCreateSpecification, IssuedCurrencyAmount } from "../../types";

function parseOfferCreate(tx: OfferCreate): FormattedOfferCreateSpecification {
  assert.ok(tx.TransactionType === "OfferCreate");
  const flags = parseOfferCreateFlags(tx.Flags as number);
  const takerGets = parseAmount(tx.TakerGets) as IssuedCurrencyAmount;
  const takerPays = parseAmount(tx.TakerPays) as IssuedCurrencyAmount;
  const quantity = flags.sell === true ? takerGets : takerPays;
  const totalPrice = flags.sell === true ? takerPays : takerGets;

  return removeUndefined({
    signers: parseSigners(tx),
    signer: parseSignerRegularKey(tx),
    delegate: parseDelegate(tx),
    source: parseSource(tx),
    flags,
    quantity: quantity,
    totalPrice: totalPrice,

    /* eslint-disable no-bitwise */
    direction: ((tx.Flags as number) & OfferCreateFlags.tfSell) === 0 ? "buy" : "sell", // @deprecated
    passive: ((tx.Flags as number) & OfferCreateFlags.tfPassive) !== 0 || undefined, // @deprecated
    immediateOrCancel: ((tx.Flags as number) & OfferCreateFlags.tfImmediateOrCancel) !== 0 || undefined, // @deprecated
    fillOrKill: ((tx.Flags as number) & OfferCreateFlags.tfFillOrKill) !== 0 || undefined, // @deprecated
    /* eslint-enable no-bitwise */

    expirationTime: parseTimestamp(tx.Expiration),
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),
  });
}

export default parseOfferCreate;
