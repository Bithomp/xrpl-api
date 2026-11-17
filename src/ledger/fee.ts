import BigNumber from "bignumber.js";
import { decode, encode, XrplDefinitionsBase } from "ripple-binary-codec";

import * as Client from "../client";
import { Connection } from "../connection";
import { dropsInXRP, MAINNET_NATIVE_CURRENCY, removeUndefined } from "../common";
import { ErrorResponse } from "../models/base_model";

export interface GetFeeOptions {
  connection?: Connection;
  tx?: any;
  definitions?: XrplDefinitionsBase;
}

export interface GetFeeDataResult {
  fee: string | null;
}

export async function getFeeData(options: GetFeeOptions = {}): Promise<GetFeeDataResult | ErrorResponse> {
  const connection: any = options.connection || Client.findConnection();
  if (!connection) {
    throw new Error("There is no connection");
  }

  const batch = getBatchTransaction(options);
  let txBlob: string | undefined;
  if (!batch) {
    if (typeof options.tx === "string") {
      txBlob = options.tx;
    } else if (typeof options.tx === "object") {
      txBlob = encode(options.tx, options.definitions);
    }
  }

  const response: any = await connection.request({
    command: "fee",
    tx_blob: txBlob,
  });

  if (!response) {
    return {
      status: "error",
      error: "invalidResponse",
    };
  }

  if (response.error) {
    const { error, error_code, error_message, error_exception, status, validated } = response;

    return removeUndefined({
      error,
      error_code,
      error_message,
      error_exception,
      status,
      validated,
    });
  }

  const openLedgerFee: any = response?.result?.drops?.open_ledger_fee;
  if (!openLedgerFee) {
    return {
      status: "error",
      error: "No open_ledger_fee data in response",
    };
  }

  let fee = new BigNumber(openLedgerFee)
    .multipliedBy(Client.feeCushion)
    .dividedBy(dropsInXRP)
    .decimalPlaces(6, BigNumber.ROUND_UP);

  if (batch) {
    fee = getBatchFee(batch, fee, connection).decimalPlaces(6, BigNumber.ROUND_UP);
  }

  return { fee: fee.toString() };
}

function getBatchTransaction(options: GetFeeOptions): any {
  if (Client.getNativeCurrency() !== MAINNET_NATIVE_CURRENCY) {
    return undefined;
  }

  let tx = options.tx;
  if (typeof tx === "string") {
    try {
      tx = decode(tx, options.definitions);
    } catch {
      // Let the node report invalid or unsupported blobs as before.
      return undefined;
    }
  }
  if (tx?.TransactionType !== "Batch") {
    return undefined;
  }

  const transactions = tx.RawTransactions;
  const validCount = Array.isArray(transactions) && transactions.length >= 2 && transactions.length <= 8;
  const validTransactions = validCount && transactions.every((entry) => {
    const type = entry?.RawTransaction?.TransactionType;
    return type && type !== "Batch";
  });
  if (!validTransactions) {
    throw new Error("Batch must contain between 2 and 8 non-Batch transactions");
  }

  return tx;
}

// rippled's fee command quotes an ordinary transaction even when given a Batch blob.
// Add the batch overhead, inner transaction costs and signature costs to that quote.
function getBatchFee(tx: any, baseFee: BigNumber, connection: Connection): BigNumber {
  if (!baseFee.isFinite() || baseFee.lte(0)) {
    throw new Error("Unable to get fee from network");
  }

  const signatureCount = (tx.Signers?.length || 0) + getBatchSignatureCount(tx.BatchSigners || []);
  let fee = baseFee.times(2 + signatureCount);
  let ownerReserve: BigNumber | undefined;

  for (const { RawTransaction: inner } of tx.RawTransactions) {
    if (["AccountDelete", "AMMCreate"].includes(inner.TransactionType)) {
      if (!ownerReserve) {
        ownerReserve = getOwnerReserve(connection);
      }
      fee = fee.plus(ownerReserve);
    } else if (inner.TransactionType === "EscrowFinish" && inner.Fulfillment !== undefined && inner.Fulfillment !== null) {
      fee = fee.plus(getEscrowFinishFee(inner.Fulfillment, baseFee));
    } else {
      fee = fee.plus(baseFee);
    }
  }

  return fee;
}

function getBatchSignatureCount(batchSigners: any[]): number {
  let count = 0;
  for (const { BatchSigner: signer } of batchSigners) {
    if (signer?.TxnSignature) {
      count += 1;
    } else {
      count += signer?.Signers?.length || 0;
    }
  }
  return count;
}

function getOwnerReserve(connection: Connection): BigNumber {
  const reserve = new BigNumber(connection.getIncrementFee() ?? 0);
  if (!reserve.isFinite() || reserve.lte(0)) {
    throw new Error("Unable to get owner reserve from connection");
  }
  return reserve;
}

function getEscrowFinishFee(fulfillment: unknown, baseFee: BigNumber): BigNumber {
  if (typeof fulfillment !== "string" || !/^(?:[A-Fa-f0-9]{2})*$/.test(fulfillment)) {
    throw new Error("Invalid EscrowFinish fulfillment");
  }
  return baseFee.times(33 + (fulfillment.length / 32));
}

/**
 * Get the current network fee for a transaction, optionally considering the provided transaction and definitions.
 * @returns {string | null} Fee in native currency units (XRP, XAH) or null if it cannot be determined
 * @exception {Error}
 */
export async function getFee(options: GetFeeOptions = {}): Promise<string | null> {
  const response = await getFeeData(options);
  if ("fee" in response) {
    return response.fee;
  }

  return null;
}
