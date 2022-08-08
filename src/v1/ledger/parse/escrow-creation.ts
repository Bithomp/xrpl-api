import * as assert from 'assert'
import parseRippledAmount from './ripple-amount'
import {parseTimestamp} from './utils'
import {removeUndefined} from '../../common'
import parseMemos from "./memos";

function parseEscrowCreation(tx: any): object {
  assert.ok(tx.TransactionType === 'EscrowCreate')

  return removeUndefined({
    amount: parseRippledAmount(tx.Amount), // Legace support
    destination: tx.Destination,
    memos: parseMemos(tx),
    condition: tx.Condition,
    allowCancelAfter: parseTimestamp(tx.CancelAfter),
    allowExecuteAfter: parseTimestamp(tx.FinishAfter),
    sourceTag: tx.SourceTag,
    destinationTag: tx.DestinationTag
  })
}

export default parseEscrowCreation
