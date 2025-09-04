import _ from "lodash";
import * as Client from "../../client";
import { removeUndefined } from "../../common";
import { ledgerTimeToUnixTime, ledgerTimeToISO8601 } from "../../models";
import { parseTransaction } from "../transaction";
import { Ledger, FormattedLedger } from "../../types";

function parseTransactionWrapper(ledgerIndex: number, includeRawTransaction: boolean, tx: any) {
  // renames metaData to meta and adds ledger_index
  const transaction = Object.assign({}, _.omit(tx, "metaData"), {
    meta: tx.metaData,
    ledger_index: ledgerIndex,
  });
  const result = parseTransaction(transaction, includeRawTransaction, Client.getNativeCurrency());
  if (!result.outcome) {
    result.outcome = {};
  }

  if (!result.outcome.ledgerIndex) {
    result.outcome.ledgerIndex = ledgerIndex;
  }

  // @deprecated, use ledgerIndex
  if (!result.outcome.ledgerVersion) {
    result.outcome.ledgerVersion = ledgerIndex;
  }

  return result;
}

function parseTransactions(transactions: any, ledgerIndex: number, includeRawTransactions: boolean) {
  if (_.isEmpty(transactions)) {
    return {};
  }
  if (typeof transactions[0] === "string") {
    return { transactionHashes: transactions };
  }
  return {
    transactions: transactions.map(_.partial(parseTransactionWrapper, ledgerIndex, includeRawTransactions)),
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
  const ledgerIndex = parseInt(ledger.ledger_index, 10);
  return removeUndefined(
    Object.assign(
      {
        stateHash: ledger.account_hash,
        close_time: ledgerTimeToUnixTime(ledger.close_time),
        closeTime: ledgerTimeToISO8601(ledger.close_time),
        closeTimeResolution: ledger.close_time_resolution,
        closeFlags: ledger.close_flags as number,
        ledgerHash: ledger.ledger_hash,
        ledgerIndex: ledgerIndex,
        ledgerVersion: ledgerIndex, // @deprecated, use ledgerIndex
        parentLedgerHash: ledger.parent_hash,
        parentCloseTime: ledgerTimeToISO8601(ledger.parent_close_time as number),
        totalDrops: ledger.total_coins,
        transactionHash: ledger.transaction_hash,
      },
      parseTransactions(ledger.transactions, ledgerIndex, includeRawTransactions),
      parseState(ledger.accountState)
    )
  );
}
