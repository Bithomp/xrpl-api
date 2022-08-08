import * as assert from 'assert'
import {removeUndefined} from '../../common'
import parseMemos from "./memos";

function parseEscrowCancellation(tx: any): object {
  assert.ok(tx.TransactionType === 'EscrowCancel')

  return removeUndefined({
    memos: parseMemos(tx),
    owner: tx.Owner,
    escrowSequence: tx.OfferSequence
  })
}

export default parseEscrowCancellation
