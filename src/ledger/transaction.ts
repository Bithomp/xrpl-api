import * as xrpl from "xrpl";
import { decode, XrplDefinitionsBase } from "ripple-binary-codec";
import { Transaction } from "xrpl";

import * as Client from "../client";
import { Connection } from "../connection";

import { xrpToDrops } from "../common";
import { sleep } from "../common/utils";
import { FormattedMemo } from "../types/objects";

import { createPaymentTransaction, Payment } from "../v1/transaction/payment";
import { ErrorResponse } from "../models/base_model";
import {
  getTxDetails,
  TransactionResponse,
  FormattedTransaction,
  AccountPaymentParamsInterface,
  ledgerTxToTx,
  isCTID,
  decodeCTID,
} from "../models/transaction";

import { signTransaction, walletFromSeed } from "../wallet";

const submitErrorsGroup = ["tem", "tef", "tel", "ter"];
const FEE_LIMIT = 0.5; // native currency (XRP, XAH)
const LEDGER_CLOSE_TIME_AWAIT = 2000; // ms
const MAX_LEDGERS_AWAIT = 5;

export interface GetTransactionOptions {
  binary?: boolean;
  minLedger?: number;
  maxLedger?: number;
  balanceChanges?: boolean;
  specification?: boolean;
  legacy?: boolean; // returns response in old RippleLib format will overwrite balanceChanges and specification, same as formatted
  formatted?: boolean; // returns response in old RippleLib format will overwrite balanceChanges and specification, same as legacy
  includeRawTransaction?: boolean; // for legacy and formatted,
  definitions?: XrplDefinitionsBase;
}

/**
 * {
 *   Account: 'rhUYLd2aUiUVYkBZYwTc5RYgCAbNHAwkeZ',
 *   Amount: '20000000',
 *   Destination: 'rKHdxvrzyCQvNzcsjLRX2mz7XiqdQHwyBH',
 *   Fee: '13',
 *   Flags: 2147483648,
 *   LastLedgerSequence: 41103241,
 *   Memos: [],
 *   Sequence: 7326,
 *   SigningPubKey: '03AA9130F4BAB351583FDDCE06CEC016C35E7F4B008FAF09DC532406E12D732D9C',
 *   TransactionType: 'Payment',
 *   TxnSignature: '3045022100953DEF1B48EBE17FDBF2E56AB4E58229F7AB3C5EA1583646E704F6A6B546294902205657341FE7A5AB42A7A985526D485CDEEF84352B6FD16E303C3367603BC490D5',
 *   date: 588708441,
 *   hash: 'A34F834AA65C01458FC0AFCDDE7F8F433DAD7B871282E8511ECDEE8E28758DCE',
 *   inLedger: 41103238,
 *   ledger_index: 41103238,
 *   meta: {
 *     AffectedNodes: [],
 *     TransactionIndex: 0,
 *     TransactionResult: 'tesSUCCESS',
 *     delivered_amount: '20000000'
 *   },
 *   validated: true
 * }
 * @exception {Error}
 */
export async function getTransaction(
  transaction: string,
  options: GetTransactionOptions = {}
): Promise<TransactionResponse | FormattedTransaction | ErrorResponse> {
  // TODO: remove when server will be updated or implement auto detection
  if (isCTID(transaction)) {
    return getTransactionByCTID(transaction, options);
  }

  const formatted = options.legacy === true || options.formatted === true;
  const connection: any = Client.findConnection("history");
  if (!connection) {
    throw new Error("There is no connection");
  }

  const response = await connection.request({
    command: "tx",
    transaction,
    binary: !!options.binary,
    min_ledger: options.minLedger,
    max_ledger: options.maxLedger,
  });

  if (!response) {
    return {
      status: "error",
      error: "invalidResponse",
    };
  }

  if (response.error) {
    const { error, error_code, error_message, status, validated } = response;

    return {
      transaction,
      error,
      error_code,
      error_message,
      status,
      validated,
    };
  }

  const result = response?.result;

  if (typeof result === "object") {
    if (formatted === true) {
      return getTxDetails(result, options.includeRawTransaction === true, undefined, options.definitions);
    }

    if (options.balanceChanges === true && typeof result.meta === "object") {
      result.balanceChanges = xrpl.getBalanceChanges(result.meta);
    }

    if (options.specification === true) {
      const details = getTxDetails(result, true, undefined, options.definitions);
      result.specification = details.specification;
      result.outcome = details.outcome;
      result.rawTransaction = details.rawTransaction;
    }
  }

  return result;
}

export async function getTransactionByCTID(
  ctid: string,
  options: GetTransactionOptions = {}
): Promise<TransactionResponse | FormattedTransaction | ErrorResponse> {
  if (!isCTID(ctid)) {
    return {
      status: "error",
      error: "invalidCTID",
    };
  }

  const { ledgerIndex, txIndex, networkID } = decodeCTID(ctid);
  const formatted = options.legacy === true || options.formatted === true;
  const connection = Client.findConnection("history", undefined, undefined, undefined, networkID);
  if (!connection) {
    throw new Error("There is no connection");
  }

  // search tx by ledger index
  const ledgerInfo = await Client.getLedger({
    ledgerIndex,
    transactions: true,
    expand: true,
    connection,
  });

  if (!ledgerInfo) {
    return {
      transaction: ctid,
      ledger_index: ledgerIndex,
      status: "error",
      error: "invalidResponse",
    };
  }

  if ("error" in ledgerInfo) {
    const { error, error_code, error_message, status, validated } = ledgerInfo;

    return {
      transaction: ctid,
      error,
      error_code,
      error_message,
      status,
      validated,
    };
  }

  const ledger: any = (ledgerInfo as any).ledger;
  const { transactions } = ledger;
  if (!Array.isArray(transactions)) {
    return {
      transaction: ctid,
      status: "error",
      error: "txnNotFound",
    };
  }

  const ledgerTx = transactions.find((tx) => tx.metaData.TransactionIndex === txIndex);
  if (!ledgerTx) {
    return {
      transaction: ctid,
      status: "error",
      error: "txnNotFound",
    };
  }

  const result = ledgerTxToTx(ledgerTx, ledgerIndex, ledger.close_time);
  if (formatted === true) {
    return getTxDetails(result, options.includeRawTransaction === true, undefined, options.definitions);
  }

  if (options.balanceChanges === true && typeof result.meta === "object") {
    result.balanceChanges = xrpl.getBalanceChanges(result.meta);
  }

  if (options.specification === true) {
    const details = getTxDetails(result, true, undefined, options.definitions);
    result.specification = details.specification;
    result.outcome = details.outcome;
    result.rawTransaction = details.rawTransaction;
  }

  return result;
}

interface SubmitPaymentTransactionV1Interface {
  sourceAddress: string;
  sourceTag?: number;
  sourceValue: string;
  sourceCurrency: string;
  destinationAddress: string;
  destinationTag?: number;
  destinationValue: string;
  destinationCurrency: string;
  networkID?: number;
  memos?: FormattedMemo[];
  secret: string;
  fee?: string;
}

export async function submitPaymentTransactionV1(
  data: SubmitPaymentTransactionV1Interface,
  definitions?: XrplDefinitionsBase,
  validateTx?: boolean
): Promise<TransactionResponse | FormattedTransaction | ErrorResponse> {
  const connection = Client.findConnection("payment, submit, !clio");
  if (!connection) {
    throw new Error("There is no connection");
  }

  // prepare transaction
  const txPayment: Payment = {
    source: {
      address: data.sourceAddress,
      tag: data.sourceTag,
      maxAmount: {
        value: data.sourceValue.toString(),
        currency: data.sourceCurrency,
      },
    },
    destination: {
      address: data.destinationAddress,
      tag: data.destinationTag,
      amount: {
        value: data.destinationValue.toString(),
        currency: data.destinationCurrency,
      },
    },
    networkID: data.networkID,
    memos: data.memos,
  };

  const transaction = createPaymentTransaction(data.sourceAddress, txPayment);
  const submitParams = await getTxSubmitParams(data.sourceAddress, transaction, definitions, connection);

  if ("error" in submitParams) {
    return submitParams as ErrorResponse;
  }

  if (data.fee) {
    transaction.Fee = xrpToDrops(data.fee);
  } else {
    transaction.Fee = submitParams.fee;
  }
  transaction.Sequence = submitParams.sequence;
  transaction.LastLedgerSequence = submitParams.lastLedgerSequence;

  // sign transaction
  const wallet = walletFromSeed(data.secret)
  const signedTransaction = signTransaction(wallet, transaction as Transaction, false, definitions, validateTx).tx_blob;

  // submit transaction
  return await submit(signedTransaction, { connection, definitions });
}

/**
 * Get account payment params, such as fee, sequence and lastLedgerSequence,
 * will be used for payment transaction, like in submitPaymentTransactionV1 function
 *
 * @param {string} account
 * @param {Connection} connection
 * @returns {Promise<AccountPaymentParamsInterface>}
 * @exception {Error}
 */
export async function getAccountPaymentParams(
  account: string,
  connection?: Connection
): Promise<AccountPaymentParamsInterface | ErrorResponse> {
  try {
    connection = connection || Client.findConnection("submit") || undefined; // eslint-disable-line no-param-reassign
    if (!connection) {
      throw new Error("There is no connection");
    }

    const feePromise = new Promise(async (resolve) => {
      const baseFee = await Client.getFee({ connection });
      let fee = parseFloat(baseFee as string);
      if (fee > FEE_LIMIT) {
        fee = FEE_LIMIT;
      }

      resolve(xrpToDrops(fee.toString()));
    });

    const sequencePromise = new Promise(async (resolve, rejects) => {
      try {
        const accountData = await Client.getAccountInfoData(account, { connection });

        if (!accountData) {
          return rejects(new Error("Account not found"));
        }

        if ("error" in accountData) {
          return rejects(new Error(accountData.error));
        }

        resolve(accountData.Sequence);
      } catch (e: any) {
        rejects(e);
      }
    });

    const lastLedgerSequencePromise = new Promise(async (resolve) => {
      try {
        const ledgerIndex = await Client.getLedgerIndex();
        if (ledgerIndex !== undefined) {
          resolve(ledgerIndex + MAX_LEDGERS_AWAIT);
        }
        resolve(undefined);
      } catch (e: any) {
        resolve(undefined);
      }
    });

    const result = await Promise.all([feePromise, sequencePromise, lastLedgerSequencePromise]);
    return {
      fee: result[0] as string,
      sequence: result[1] as number,
      lastLedgerSequence: result[2] as number,
      networkID: connection.getNetworkID(),
    };
  } catch (e: any) {
    return {
      account,
      status: "error",
      error: e.message,
    };
  }
}

/**
 * Get account payment params, such as fee, sequence and lastLedgerSequence,
 * will be used for payment transaction, like in submitPaymentTransactionV1 function
 *
 * @param {string} account
 * @param {string} tx string or object
 * @param {Connection} connection
 * @returns {Promise<AccountPaymentParamsInterface>}
 * @exception {Error}
 */
export async function getTxSubmitParams(
  account: string,
  tx?: string | any,
  definitions?: XrplDefinitionsBase,
  connection?: Connection
): Promise<AccountPaymentParamsInterface | ErrorResponse> {
  try {
    connection = connection || Client.findConnection("submit") || undefined; // eslint-disable-line no-param-reassign
    if (!connection) {
      throw new Error("There is no connection");
    }

    const feePromise = new Promise(async (resolve, rejects) => {
      try {
        if (tx && typeof tx === "object") {
          // eslint-disable-next-line no-param-reassign
          tx = { ...tx, Sequence: 0, Fee: "0", SigningPubKey: "" };
        }

        const baseFee = await Client.getFee({ connection, tx, definitions });
        let fee = parseFloat(baseFee as string);
        if (fee > FEE_LIMIT) {
          fee = FEE_LIMIT;
        }

        resolve(xrpToDrops(fee.toString()));
      } catch (e: any) {
        rejects(e);
      }
    });

    const sequencePromise = new Promise(async (resolve, rejects) => {
      try {
        const accountData = await Client.getAccountInfoData(account, { connection });

        if (!accountData) {
          return rejects(new Error("Account not found"));
        }

        if ("error" in accountData) {
          return rejects(new Error(accountData.error));
        }

        resolve(accountData.Sequence);
      } catch (e: any) {
        rejects(e);
      }
    });

    const lastLedgerSequencePromise = new Promise(async (resolve) => {
      try {
        const ledgerIndex = await Client.getLedgerIndex();
        if (ledgerIndex !== undefined) {
          resolve(ledgerIndex + MAX_LEDGERS_AWAIT);
        }
        resolve(undefined);
      } catch (e: any) {
        resolve(undefined);
      }
    });

    const result = await Promise.all([feePromise, sequencePromise, lastLedgerSequencePromise]);
    return {
      fee: result[0] as string,
      sequence: result[1] as number,
      lastLedgerSequence: result[2] as number,
      networkID: connection.getNetworkID(),
    };
  } catch (e: any) {
    return {
      account,
      status: "error",
      error: e.message,
    };
  }
}

export interface SubmitOptionsInterface {
  connection?: Connection;
  definitions?: XrplDefinitionsBase;
}

/**
 * Submit signed transaction to the network
 * @param {string} signedTransaction
 * @param {SubmitOptionsInterface} options
 * @returns {Promise<TransactionResponse | FormattedTransaction | ErrorResponse>}
 * @exception {Error}
 */
export async function submit(
  signedTransaction: string,
  options: SubmitOptionsInterface = {}
): Promise<TransactionResponse | FormattedTransaction | ErrorResponse> {
  const connection: any = options.connection || Client.findConnection("submit");
  if (!connection) {
    throw new Error("There is no connection");
  }

  const response = await connection.submit(signedTransaction);
  if (response.error) {
    return response;
  }

  const result = response?.result;
  const resultGroup = result?.engine_result?.slice(0, 3);
  // if tx is failed and not queued or kept
  if ((submitErrorsGroup.includes(resultGroup) && result?.engine_result !== "terQUEUED") || result?.kept === false) {
    return result;
  }

  const txHash = result?.tx_json?.hash;
  if (!txHash) {
    return result;
  }

  let lastLedger = 0;
  const transaction = decode(signedTransaction, options.definitions);
  if (transaction.LastLedgerSequence) {
    lastLedger = transaction.LastLedgerSequence as number;
  } else {
    const ledgerIndex = await Client.getLedgerIndex();
    if (ledgerIndex !== undefined) {
      const ledgersToWait = MAX_LEDGERS_AWAIT * 2;
      lastLedger = ledgerIndex + ledgersToWait;
    }
  }

  const finalResult = await waitForFinalTransactionOutcome(txHash, lastLedger);
  return finalResult;
}

/**
 * Wait for final transaction outcome
 * @param {string} txHash
 * @param {number} lastLedger
 * @returns {Promise<TransactionResponse | FormattedTransaction | ErrorResponse>}
 * @exception {Error}
 * @private
 */
async function waitForFinalTransactionOutcome(
  txHash: string,
  lastLedger: number
): Promise<TransactionResponse | FormattedTransaction | ErrorResponse> {
  await sleep(LEDGER_CLOSE_TIME_AWAIT);

  const tx = await getTransaction(txHash);
  const error = (tx as any)?.error;
  if (error === "Not connected") {
    return tx;
  }

  if (!tx || error === "txnNotFound" || (tx as any).validated !== true) {
    const ledgerIndex = await Client.getLedgerIndex();
    if (ledgerIndex === undefined || lastLedger > ledgerIndex) {
      return waitForFinalTransactionOutcome(txHash, lastLedger);
    }
  }

  if (tx && !tx.hasOwnProperty("error") && (tx as any).validated === false) {
    if (tx.hasOwnProperty("LastLedgerSequence")) {
      return { ...tx, status: "timeout", error: "lastLedgerIndexReached" } as any;
    } else {
      return { ...tx, status: "timeout", error: "waitingForValidation" } as any;
    }
  }

  return tx;
}
