import * as _ from "lodash";
import { getBalanceChanges } from "xrpl";

import * as Client from "../client";
import { LedgerIndex } from "../models/ledger_index";
import { compareTransactions } from "../common/utils";

const DEFAULT_LIMIT = 200;
const MAX_LIMIT_WITH_FILTER = 20;
const MAX_WITH_TAG = 3;

export interface GetTransactionsOptions {
  ledgerIndexMin?: number;
  ledgerIndexMax?: number;
  ledgerHash?: string;
  ledgerIndex?: LedgerIndex;
  binary?: boolean;
  forward?: boolean;
  limit: number;
  marker?: unknown;
}

/**
 *  The account_tx method retrieves a list of transactions that involved the specified account.
 *
 *  {
 *   "account": "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z",
 *   "ledger_index_max": 69453013,
 *   "ledger_index_min": 32570,
 *   "limit": 1,
 *   "marker": {
 *     "ledger": 16658790,
 *     "seq": 1
 *   },
 *   "transactions": [
 *     {
 *       "meta": {
 *         "AffectedNodes": [
 *           {
 *             "ModifiedNode": {
 *               "FinalFields": {
 *                 "Account": "rBRVqcXrm1YAbanngTxDfH15LNb6TjNmxk",
 *                 "Balance": "19897873078",
 *                 "Flags": 393216,
 *                 "OwnerCount": 1,
 *                 "Sequence": 98303
 *               },
 *               "LedgerEntryType": "AccountRoot",
 *               "LedgerIndex": "A1C341684C7E01E81208A9F59BF6C0DAD245BEA5ED399E52D109AEFFB29B0C69",
 *               "PreviousFields": {
 *                 "Balance": "19928893080",
 *                 "Sequence": 98302
 *               },
 *               "PreviousTxnID": "9EFDB125992DB9F12C3389D34045B1D4C87B3D8B5B82F05B8B541EFC4579EA53",
 *               "PreviousTxnLgrSeq": 16658441
 *             }
 *           },
 *           {
 *             "CreatedNode": {
 *               "LedgerEntryType": "AccountRoot",
 *               "LedgerIndex": "EE994230153E2207737ACE5CDA73F8275E81D05A45C6937B62B0FF24C81140BA",
 *               "NewFields": {
 *                 "Account": "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z",
 *                 "Balance": "31000000",
 *                 "Sequence": 1
 *               }
 *             }
 *           }
 *         ],
 *         "TransactionIndex": 4,
 *         "TransactionResult": "tesSUCCESS",
 *         "delivered_amount": "31000000"
 *       },
 *       "tx": {
 *         "Account": "rBRVqcXrm1YAbanngTxDfH15LNb6TjNmxk",
 *         "Amount": "31000000",
 *         "Destination": "rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z",
 *         "Fee": "20002",
 *         "Flags": 2147483648,
 *         "Sequence": 98302,
 *         "SigningPubKey": "02F81DBCD76D399BCF49F3812870A1234FF004DC62169915588AF7749A4D57499F",
 *         "SourceTag": 1617004677,
 *         "TransactionType": "Payment",
 *         "TxnSignature": "304502210082B18C90FBDA585C5527C6D2C9D244C6482A2E439FD152F37A2E2AE7F33315C102205CDC77D7909EA8D7FB8E5A51EA674EF514D251EDAE0101FAB0C1BD3F42E01AA7",
 *         "date": 498983820,
 *         "hash": "2D6894BCCA14919218576E8204E4715301989D98CAEDA304BB465949459972D3",
 *         "inLedger": 16658556,
 *         "ledger_index": 16658556
 *       },
 *       "validated": true
 *     }
 *   ],
 *   "validated": true
 * }
 * @exception {Error}
 */
export async function getTransactions(
  account: string,
  options: GetTransactionsOptions = { limit: DEFAULT_LIMIT }
): Promise<object | null> {
  const connection: any = Client.findConnection("history");
  if (!connection) {
    throw new Error("There is no connection");
  }

  await connection.connect();
  const response = await connection.request({
    command: "account_tx",
    account,
    ledger_index_min: options.ledgerIndexMin,
    ledger_index_max: options.ledgerIndexMax,
    ledger_hash: options.ledgerHash,
    ledger_index: options.ledgerIndex,
    binary: !!options.binary,
    forward: !!options.forward,
    limit: options.limit,
    marker: options.marker,
  });

  if (!response) {
    return null;
  }

  if (response.error) {
    const { error, error_code, error_message, status, validated } = response;

    return {
      account,
      error,
      error_code,
      error_message,
      status,
      validated,
    };
  }

  return response?.result;
}

export interface FindTransactionsOptions extends GetTransactionsOptions {
  startTxHash?: string;
  excludeFailures?: boolean;
  initiated?: boolean;
  counterparty?: string;
  types?: string[];
  sourceTag?: number;
  destinationTag?: number;
  timeout?: number;
  balanceChanges?: boolean;
}

interface FindProcessTransactionsOptions extends FindTransactionsOptions {
  startTx?: any;
}

export async function findTransactions(
  account: string,
  options: FindTransactionsOptions = { limit: DEFAULT_LIMIT, timeout: 15000 }
): Promise<object[]> {
  let transactions = [];
  const timeStart = new Date();

  // limit if sourceTag or destinationTag was used
  if ((options.sourceTag as number) > 0 || (options.destinationTag as number) > 0) {
    if (options.limit > MAX_WITH_TAG) {
      options.limit = MAX_WITH_TAG;
    }
  } else if (options.types || options.initiated || options.counterparty) {
    if (options.limit > MAX_LIMIT_WITH_FILTER) {
      options.limit = MAX_LIMIT_WITH_FILTER;
    }
  }

  await updateStartTxOptions(options);

  while (transactions.length !== options.limit) {
    const currentTime = new Date();
    // timeout validation
    if (options.timeout && currentTime.getTime() - timeStart.getTime() > options.timeout) {
      break;
    }

    const accountTransactions: any = await getTransactions(account, options);
    if (!accountTransactions || accountTransactions.error) {
      break;
    }
    let newTransactions = accountTransactions.transactions;
    // save marker for next request
    options.marker = accountTransactions.marker;

    newTransactions = newTransactions
      .filter(_.partial(filterHelperTransactions, account, options))
      .filter(_.partial(filterHelperStartTx, options));

    if (options.balanceChanges === true) {
      for (let newTransaction of newTransactions) {
        newTransaction.balanceChanges = getBalanceChanges(newTransaction.meta);
      }
    }

    // save transactions
    transactions = transactions.concat(newTransactions);

    // clenup over limit
    transactions.splice(0, transactions.length - options.limit);
  }

  return transactions;
}

async function updateStartTxOptions(options: FindProcessTransactionsOptions) {
  // https://github.com/XRPLF/xrpl.js/blob/6e0fff2ad642c2f94ddb83a23f57dff49d1678ec/src/ledger/transactions.ts#L205
  if (options.startTxHash) {
    const accountTransaction: any = await Client.getTransaction(options.startTxHash);
    if (accountTransaction && !accountTransaction.error) {
      // set transaction to search after
      (options as FindProcessTransactionsOptions).startTx = {
        tx: accountTransaction,
        meta: accountTransaction.meta,
      };
      // set min/max ledger to search from
      if (options.forward === true) {
        options.ledgerIndexMin = (options as FindProcessTransactionsOptions).startTx.tx.ledger_index;
      } else {
        options.ledgerIndexMax = (options as FindProcessTransactionsOptions).startTx.tx.ledger_index;
      }
    }
  }
}

// https://github.com/XRPLF/xrpl.js/blob/6e0fff2ad642c2f94ddb83a23f57dff49d1678ec/src/ledger/transactions.ts#L87
function filterHelperStartTx(options: FindProcessTransactionsOptions, transaction: any): boolean {
  return (
    !options.startTx ||
    (options.forward === true
      ? compareTransactions(transaction, options.startTx) > 0
      : compareTransactions(transaction, options.startTx) < 0)
  );
}

// https://github.com/XRPLF/xrpl.js/blob/6e0fff2ad642c2f94ddb83a23f57dff49d1678ec/src/ledger/transactions.ts#L64
function filterHelperTransactions(account: string, options: FindProcessTransactionsOptions, transaction: any): boolean {
  // validated transaction
  if (transaction.validated === false) {
    return false;
  }

  // filter excludeFailures
  if (options.excludeFailures === true && transaction.meta.TransactionResult !== "tesSUCCESS") {
    return false;
  }

  // filter types
  if (options.types && !options.types.includes(transaction.tx.TransactionType)) {
    return false;
  }

  // filter initiated
  if (options.initiated === true && transaction.tx.Account !== account) {
    return false;
  }

  // filter not initiated
  if (options.initiated === false && transaction.tx.Account === account) {
    return false;
  }

  // filter counterparty
  if (options.counterparty && !counterpartyFilter(options, transaction)) {
    return false;
  }

  // filter sourceTag
  if (typeof options.sourceTag === "number" && transaction.tx.SourceTag !== options.sourceTag) {
    return false;
  }

  // filter destinationTag
  if (typeof options.destinationTag === "number" && transaction.tx.DestinationTag !== options.destinationTag) {
    return false;
  }

  return true;
}

function counterpartyFilter(options: FindProcessTransactionsOptions, transaction: any) {
  if (transaction.tx.Account === options.counterparty) {
    return true;
  }

  if (transaction.tx.Destination === options.counterparty) {
    return true;
  }

  if (transaction.tx.SendMax?.issuer === options.counterparty) {
    return true;
  }

  return false;
}
