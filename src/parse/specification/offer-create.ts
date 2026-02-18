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
import parseTxOfferCreateFlags from "../ledger/tx-offer-create-flags";
import { FormattedOfferCreateSpecification, IssuedCurrencyAmount } from "../../types";

function parseOfferCreate(tx: OfferCreate, nativeCurrency?: string): FormattedOfferCreateSpecification {
  assert.ok(tx.TransactionType === "OfferCreate");
  const flags = parseTxOfferCreateFlags(tx.Flags as number, { nativeCurrency });
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
    takerGets,
    takerPays,
    expirationTime: parseTimestamp(tx.Expiration),
    domainID: tx.DomainID,
    emittedDetails: parseEmittedDetails(tx),
    memos: parseMemos(tx),

    /* eslint-disable no-bitwise */
    direction: ((tx.Flags as number) & OfferCreateFlags.tfSell) === 0 ? "buy" : "sell", // @deprecated, use flags.sell
    passive: ((tx.Flags as number) & OfferCreateFlags.tfPassive) !== 0 || undefined, // @deprecated, use flags.passive
    immediateOrCancel: ((tx.Flags as number) & OfferCreateFlags.tfImmediateOrCancel) !== 0 || undefined, // @deprecated, use flags.immediateOrCancel
    fillOrKill: ((tx.Flags as number) & OfferCreateFlags.tfFillOrKill) !== 0 || undefined, // @deprecated, use flags.fillOrKill
    quantity: quantity, // @deprecated, use takerGets instead
    totalPrice: totalPrice, // @deprecated, use takerPays instead
    /* eslint-enable no-bitwise */
  });
}

export default parseOfferCreate;
