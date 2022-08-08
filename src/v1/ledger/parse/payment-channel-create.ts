import * as assert from 'assert'
import {parseTimestamp} from './utils'
import {removeUndefined} from '../../common'
import parseRippledAmount from './ripple-amount'
import parseMemos from "./memos";

function parsePaymentChannelCreate(tx: any): object {
  assert.ok(tx.TransactionType === 'PaymentChannelCreate')

  return removeUndefined({
    memos: parseMemos(tx),
    amount: parseRippledAmount(tx.Amount), // Legace support
    destination: tx.Destination,
    settleDelay: tx.SettleDelay,
    publicKey: tx.PublicKey,
    cancelAfter: tx.CancelAfter && parseTimestamp(tx.CancelAfter),
    sourceTag: tx.SourceTag,
    destinationTag: tx.DestinationTag
  })
}

export default parsePaymentChannelCreate
