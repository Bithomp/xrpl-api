import _ from "lodash";
import { removeUndefined } from "../../common";
import { ledgerTimeToUnixTime, ledgerTimeToISO8601 } from "../../models";
import { parseTransaction } from "../transaction";
import { Ledger, FormattedLedger } from "../../v1/common/types/objects";

function parseTransactionWrapper(ledgerVersion: number, includeRawTransaction: boolean, tx: any) {
  // renames metaData to meta and adds ledger_index
  const transaction = Object.assign({}, _.omit(tx, "metaData"), {
    meta: tx.metaData,
    ledger_index: ledgerVersion,
  });
  const result = parseTransaction(transaction, includeRawTransaction);
  if (!result.outcome) {
    result.outcome = {};
  }
  if (!result.outcome.ledgerVersion) {
    result.outcome.ledgerVersion = ledgerVersion;
  }
  return result;
}

function parseTransactions(transactions: any, ledgerVersion: number, includeRawTransactions: boolean) {
  if (_.isEmpty(transactions)) {
    return {};
  }
  if (typeof transactions[0] === "string") {
    return { transactionHashes: transactions };
  }
  return {
    transactions: transactions.map(_.partial(parseTransactionWrapper, ledgerVersion, includeRawTransactions)),
  };
}

function parseState(state) {
  if (_.isEmpty(state)) {
    return {};
  }
  if (typeof state[0] === "string") {
    return { stateHashes: state };
  }
  return { rawState: JSON.stringify(state) };
}

/**
 * @param {Ledger} ledger must be a *closed* ledger with valid `close_time` and `parent_close_time`
 * @returns {FormattedLedger} formatted ledger
 * @throws RangeError: Invalid time value (ledgerTimeToISO8601)
 */
export function parseLedger(ledger: Ledger, includeRawTransactions: boolean): FormattedLedger {
  const ledgerVersion = parseInt(ledger.ledger_index, 10);
  return removeUndefined(
    Object.assign(
      {
        stateHash: ledger.account_hash,
        close_time: ledgerTimeToUnixTime(ledger.close_time),
        closeTime: ledgerTimeToISO8601(ledger.close_time),
        closeTimeResolution: ledger.close_time_resolution,
        closeFlags: ledger.close_flags as number,
        ledgerHash: ledger.ledger_hash,
        // tslint:disable-next-line:object-literal-shorthand
        ledgerVersion: ledgerVersion,
        parentLedgerHash: ledger.parent_hash,
        parentCloseTime: ledgerTimeToISO8601(ledger.parent_close_time as number),
        totalDrops: ledger.total_coins,
        transactionHash: ledger.transaction_hash,
      },
      parseTransactions(ledger.transactions, ledgerVersion, includeRawTransactions),
      parseState(ledger.accountState)
    )
  );
}
