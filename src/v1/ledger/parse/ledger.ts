import * as _ from 'lodash'
import {removeUndefined, rippleTimeToISO8601, rippleToUnixTime} from '../../common'
import {parseTransaction} from './transaction'
import {Ledger} from '../../common/types/objects'

export type FormattedLedger = {
  // TODO: properties in type don't match response object. Fix!
  // closed: boolean,
  stateHash: string
  closeTime: string
  closeTimeResolution: number
  closeFlags: number
  ledgerHash: string
  ledgerVersion: number
  parentLedgerHash: string
  parentCloseTime: string
  totalDrops: string
  transactionHash: string
  // tslint:disable-next-line:array-type
  transactions?: Array<object>
  // tslint:disable-next-line:array-type
  transactionHashes?: Array<string>
  rawState?: string
  // tslint:disable-next-line:array-type
  stateHashes?: Array<string>
}

function parseTransactionWrapper(ledgerVersion: number, includeRawTransaction: boolean, tx: any) {
  // renames metaData to meta and adds ledger_index
  const transaction = Object.assign({}, _.omit(tx, 'metaData'), {
    meta: tx.metaData,
    ledger_index: ledgerVersion
  })
  const result = parseTransaction(transaction, includeRawTransaction)
  if (!result.outcome.ledgerVersion) {
    result.outcome.ledgerVersion = ledgerVersion
  }
  return result
}

function parseTransactions(transactions: any, ledgerVersion: number, includeRawTransactions: boolean) {
  if (_.isEmpty(transactions)) {
    return {}
  }
  if (typeof transactions[0] === 'string') {
    return {transactionHashes: transactions}
  }
  return {
    transactions: transactions.map(
      _.partial(parseTransactionWrapper, ledgerVersion, includeRawTransactions)
    )
  }
}

function parseState(state) {
  if (_.isEmpty(state)) {
    return {}
  }
  if (typeof state[0] === 'string') {
    return {stateHashes: state}
  }
  return {rawState: JSON.stringify(state)}
}

/**
 * @param {Ledger} ledger must be a *closed* ledger with valid `close_time` and `parent_close_time`
 * @returns {FormattedLedger} formatted ledger
 * @throws RangeError: Invalid time value (rippleTimeToISO8601)
 */
export function parseLedger(ledger: Ledger, includeRawTransactions: boolean): FormattedLedger {
  const ledgerVersion = parseInt(ledger.ledger_index, 10)
  return removeUndefined(
    Object.assign(
      {
        stateHash: ledger.account_hash,
        close_time: rippleToUnixTime(ledger.close_time),
        closeTime: rippleTimeToISO8601(ledger.close_time),
        closeTimeResolution: ledger.close_time_resolution,
        closeFlags: ledger.close_flags as number,
        ledgerHash: ledger.ledger_hash,
        // tslint:disable-next-line:object-literal-shorthand
        ledgerVersion: ledgerVersion,
        parentLedgerHash: ledger.parent_hash,
        parentCloseTime: rippleTimeToISO8601(ledger.parent_close_time as number),
        totalDrops: ledger.total_coins,
        transactionHash: ledger.transaction_hash
      },
      parseTransactions(ledger.transactions, ledgerVersion, includeRawTransactions),
      parseState(ledger.accountState)
    )
  )
}
