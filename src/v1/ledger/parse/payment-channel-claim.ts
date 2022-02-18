import * as assert from 'assert'
import {removeUndefined, txFlags} from '../../common'
import parseAmount from './amount'
import {parseMemos} from './utils'
const claimFlags = txFlags.PaymentChannelClaim

function parsePaymentChannelClaim(tx: any): object {
  assert.ok(tx.TransactionType === 'PaymentChannelClaim')

  return removeUndefined({
    memos: parseMemos(tx),
    channel: tx.Channel,
    balance: tx.Balance && parseAmount(tx.Balance).value,
    amount: tx.Amount && parseAmount(tx.Amount).value,
    signature: tx.Signature,
    publicKey: tx.PublicKey,
    // tslint:disable-next-line:no-bitwise
    renew: Boolean(tx.Flags & claimFlags.Renew) || undefined,
    // tslint:disable-next-line:no-bitwise
    close: Boolean(tx.Flags & claimFlags.Close) || undefined
  })
}

export default parsePaymentChannelClaim
