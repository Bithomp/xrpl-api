import * as _ from 'lodash'
import * as assert from 'assert'
import { PaymentFlags } from "xrpl";
import {isPartialPayment} from './utils'
import {removeUndefined} from '../../common'
import parseAmount from './amount'
import parseMemos from "./memos";

function isNoDirectRipple(tx) {
  // tslint:disable-next-line:no-bitwise
  return (tx.Flags & PaymentFlags.tfNoDirectRipple) !== 0
}

function isQualityLimited(tx) {
  // tslint:disable-next-line:no-bitwise
  return (tx.Flags & PaymentFlags.tfLimitQuality) !== 0
}

function removeGenericCounterparty(amount, address) {
  return amount.counterparty === address
    ? _.omit(amount, 'counterparty')
    : amount
}

// Payment specification
function parsePayment(tx: any): object {
  assert.ok(tx.TransactionType === 'Payment')

  const source = {
    address: tx.Account,
    maxAmount: removeGenericCounterparty(
      parseAmount(tx.SendMax || tx.Amount),
      tx.Account
    ),
    tag: tx.SourceTag
  }

  const destination: {
    address: string
    tag: number | undefined
  } = {
    address: tx.Destination,
    tag: tx.DestinationTag
    // Notice that `amount` is omitted to prevent misinterpretation
  }

  return removeUndefined({
    source: removeUndefined(source),
    destination: removeUndefined(destination),
    memos: parseMemos(tx),
    invoiceID: tx.InvoiceID,
    paths: tx.Paths ? JSON.stringify(tx.Paths) : undefined,
    allowPartialPayment: isPartialPayment(tx) || undefined,
    noDirectRipple: isNoDirectRipple(tx) || undefined,
    limitQuality: isQualityLimited(tx) || undefined
  })
}

export default parsePayment
