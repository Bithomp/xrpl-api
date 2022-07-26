import * as assert from 'assert'
import {parseTimestamp,parseMemos} from './utils'
import {removeUndefined} from '../../common'
import parseRippledAmount from './ripple-amount'

function parsePaymentChannelFund(tx: any): object {
  assert.ok(tx.TransactionType === 'PaymentChannelFund')

  return removeUndefined({
    memos: parseMemos(tx),
    channel: tx.Channel,
    amount: parseRippledAmount(tx.Amount), // Legace support
    expiration: tx.Expiration && parseTimestamp(tx.Expiration)
  })
}

export default parsePaymentChannelFund
