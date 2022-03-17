import * as xrpl from "xrpl";
import { decode } from "ripple-binary-codec";

import { Transaction } from "xrpl";
import * as Client from "../client";
import { Connection } from "../connection";
import { sleep } from "../common/utils";
import { getTxDetails } from "../models/transaction";
import { createPaymentTransaction, Payment } from "../v1/transaction/payment";
import { Memo } from "../v1/common/types/objects";
import { xrpToDrops } from "../v1/common";

const submitErrorsGroup = ["tem", "tef", "tel", "ter"];
const FEE_LIMIT = 0.5; // XRP
const LEDGER_CLOSE_TIME_AWAIT = 2000; // ms
const MAX_LEDGERS_AWAIT = 5;

export interface GetTransactionOptions {
  binary?: boolean;
  minLedger?: number;
  maxLedger?: number;
  balanceChanges?: boolean;
  specification?: boolean;
  legacy?: boolean; // returns response in old RippleLib format will overwrite balanceChanges and specification
  includeRawTransaction?: boolean; // for legacy
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
export async function getTransaction(transaction: string, options: GetTransactionOptions = {}): Promise<object | null> {
  const connection: any = Client.findConnection("history");
  if (!connection) {
    throw new Error("There is no connection");
  }

  await connection.connect();
  const response = await connection.request({
    command: "tx",
    transaction,
    binary: !!options.binary,
    min_ledger: options.minLedger,
    max_ledger: options.maxLedger,
  });

  if (!response) {
    return null;
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
    if (options.legacy === true) {
      return getTxDetails(result, options.includeRawTransaction === true);
    }

    if (options.balanceChanges === true && typeof result.meta === "object") {
      result.balanceChanges = xrpl.getBalanceChanges(result.meta);
    }

    if (options.specification === true) {
      const details = getTxDetails(result, true);
      result.specification = details.specification;
      result.outcome = details.outcome;
      result.rawTransaction = details.rawTransaction;
    }
  }

  return result;
}

// sourceAddress: "rJcEbVWJ7xFjL8J9LsbxBMVSRY2C7DU7rz",
// sourceValue: "0.0001",
// sourceCurrency: "XRP",
// destinationAddress: "rBbfoBCNMpAaj35K5A9UV9LDkRSh6ZU9Ef",
// destinationValue: "0.0001",
// destinationCurrency: "XRP",
// memo

interface LegacyPaymentInterface {
  sourceAddress: string;
  sourceValue: string;
  sourceCurrency: string;
  destinationAddress: string;
  destinationValue: string;
  destinationCurrency: string;
  memo: Memo[];
  secret: string;
}

export async function legacyPayment(data: LegacyPaymentInterface): Promise<object | null> {
  const connection: any = Client.findConnection();
  if (!connection) {
    throw new Error("There is no connection");
  }

  // prepare transaction
  const txPayment: Payment = {
    source: {
      address: data.sourceAddress,
      maxAmount: {
        value: data.sourceValue.toString(),
        currency: data.sourceCurrency,
      },
    },
    destination: {
      address: data.destinationAddress,
      amount: {
        value: data.destinationValue.toString(),
        currency: data.destinationCurrency,
      },
    },
    memos: data.memo,
  };

  const transaction = createPaymentTransaction(data.sourceAddress, txPayment);
  const paymentParams = await getLedgerPaymentParams(data.sourceAddress, connection);
  transaction.Fee = paymentParams.fee;
  transaction.Sequence = paymentParams.sequence;
  transaction.LastLedgerSequence = paymentParams.lastLedgerSequence;

  // sign transaction
  const wallet = xrpl.Wallet.fromSeed(data.secret);
  const signedTransaction = wallet.sign(transaction as Transaction).tx_blob;

  // submit transaction
  return await submit(signedTransaction, { connection: connection });
}

interface LedgerPaymentParamsInterface {
  fee: string;
  sequence: number;
  lastLedgerSequence: number;
}

async function getLedgerPaymentParams(account: string, connection: Connection): Promise<LedgerPaymentParamsInterface> {
  const fee = new Promise(async (resolve) => {
    const baseFee = await Client.getFee({ connection: connection });
    let fee = parseFloat(baseFee as string);
    if (fee > FEE_LIMIT) {
      fee = FEE_LIMIT;
    }
    resolve(xrpToDrops(fee));
  });

  const sequence = new Promise(async (resolve) => {
    const accountInfo = await Client.getAccountInfo(account, { connection: connection });
    resolve((accountInfo as any)?.account_data?.Sequence);
  });

  const lastLedgerSequence = new Promise(async (resolve) => {
    resolve(parseInt(((await Client.getLedger()) as any).ledger_index, 10) + MAX_LEDGERS_AWAIT);
  });

  const result = await Promise.all([fee, sequence, lastLedgerSequence]);
  return {
    fee: result[0] as string,
    sequence: result[1] as number,
    lastLedgerSequence: result[2] as number,
  };
}

export interface submitoOptions {
  connection?: Connection;
}

export async function submit(signedTransaction: string, options: submitoOptions = {}): Promise<object | null> {
  const connection: any = options.connection || Client.findConnection();
  if (!connection) {
    throw new Error("There is no connection");
  }

  const response = await connection.submit(signedTransaction);
  const result = response?.result;
  const resultGroup = result.engine_result.slice(0, 3);
  if (submitErrorsGroup.includes(resultGroup) && result.engine_result != "terQUEUED") {
    return result;
  }

  const txHash = result.tx_json?.hash;
  if (!txHash) {
    return result;
  }

  let lastLedger = 0;
  const transaction = decode(signedTransaction);
  if (transaction.LastLedgerSequence) {
    lastLedger = transaction.LastLedgerSequence as number;
  } else {
    lastLedger = parseInt(((await Client.getLedger()) as any).ledger_index, 10) + MAX_LEDGERS_AWAIT;
  }

  return await waitForFinalTransactionOutcome(txHash, lastLedger);
}

async function waitForFinalTransactionOutcome(txHash: string, lastLedger: number): Promise<object | null> {
  await sleep(LEDGER_CLOSE_TIME_AWAIT);

  const tx = await getTransaction(txHash);
  if (!tx) {
    return waitForFinalTransactionOutcome(txHash, lastLedger);
  }

  if ((tx as any).error === "txnNotFound" || (tx as any).validated !== true) {
    const ledgerIndex = parseInt(((await Client.getLedger()) as any).ledger_index, 10);
    if (lastLedger > ledgerIndex) {
      return waitForFinalTransactionOutcome(txHash, lastLedger);
    }
  }

  return tx;
}
