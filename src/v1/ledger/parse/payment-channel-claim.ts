import * as assert from 'assert'
import { PaymentChannelClaimFlags } from "xrpl";
import {removeUndefined} from '../../common'
import parseRippledAmount from './ripple-amount'
import parseMemos from "./memos";

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
    renew: Boolean(tx.Flags & PaymentChannelClaimFlags.tfRenew) || undefined,
    // tslint:disable-next-line:no-bitwise
    close: Boolean(tx.Flags & PaymentChannelClaimFlags.tfClose) || undefined
  })
}

export default parsePaymentChannelClaim
