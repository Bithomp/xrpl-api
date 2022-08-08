import * as assert from 'assert'
import {removeUndefined, txFlags} from '../../common'
import parseRippledAmount from './ripple-amount'
import parseMemos from "./memos";
const claimFlags = txFlags.PaymentChannelClaim

function parsePaymentChannelClaim(tx: any): object {
  assert.ok(tx.TransactionType === 'PaymentChannelClaim')

  return removeUndefined({
    memos: parseMemos(tx),
    channel: tx.Channel,
    balance: parseRippledAmount(tx.Balance), // Legace support
    amount: parseRippledAmount(tx.Amount), // Legace support
    signature: tx.Signature,
    publicKey: tx.PublicKey,
    // tslint:disable-next-line:no-bitwise
    renew: Boolean(tx.Flags & claimFlags.Renew) || undefined,
    // tslint:disable-next-line:no-bitwise
    close: Boolean(tx.Flags & claimFlags.Close) || undefined
  })
}

export default parsePaymentChannelClaim
