import BigNumber from "bignumber.js";
import { decode, encode, XrplDefinitionsBase } from "ripple-binary-codec";

import * as Client from "../client";
import { Connection } from "../connection";
import { dropsInXRP, removeUndefined } from "../common";
import { ErrorResponse } from "../models/base_model";
import { getServerInfo } from "./server_info";

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

  const isXRP = Client.getNativeCurrency() === "XRP";
  let tx = options.tx;
  if (isXRP && typeof tx === "string") {
    try {
      tx = decode(tx, options.definitions);
    } catch {
      // Let the node report invalid or unsupported blobs as before.
    }
  }
  const batch = isXRP && tx?.TransactionType === "Batch" ? tx : undefined;
  if (batch && (
    !Array.isArray(batch.RawTransactions) || batch.RawTransactions.length < 2 || batch.RawTransactions.length > 8 ||
    batch.RawTransactions.some((entry) => !entry?.RawTransaction?.TransactionType || entry.RawTransaction.TransactionType === "Batch")
  )) {
    throw new Error("Batch must contain between 2 and 8 non-Batch transactions");
  }

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

  const fee: any = new BigNumber(openLedgerFee)
    .multipliedBy(Client.feeCushion)
    .dividedBy(dropsInXRP)
    .decimalPlaces(6, BigNumber.ROUND_UP);

  return {
    fee: batch ? (await getBatchFee(batch, fee, connection)).decimalPlaces(6, BigNumber.ROUND_UP).toString() : fee.toString(),
  };
}

// rippled's fee command quotes an ordinary transaction even when given a Batch blob.
// Add the batch overhead, inner transaction costs and signature costs to that quote.
async function getBatchFee(tx: any, baseFee: BigNumber, connection: Connection): Promise<BigNumber> {
  if (!baseFee.isFinite() || baseFee.lte(0)) {
    throw new Error("Unable to get fee from network");
  }

  const batchSignatures = (tx.BatchSigners || []).reduce((count, { BatchSigner }) =>
    count + (BatchSigner?.TxnSignature ? 1 : (BatchSigner?.Signers?.length || 0)), 0);
  let fee = baseFee.times(2 + (tx.Signers?.length || 0) + batchSignatures);
  let ownerReserve: BigNumber | undefined;

  for (const { RawTransaction: inner } of tx.RawTransactions) {
    if (["AccountDelete", "AMMCreate"].includes(inner.TransactionType)) {
      if (!ownerReserve) {
        const serverInfo: any = await getServerInfo({ connection });
        ownerReserve = new BigNumber(serverInfo?.info?.validated_ledger?.reserve_inc_xrp ?? 0);
        if (!ownerReserve.isFinite() || ownerReserve.lte(0)) {
          throw new Error("Unable to get owner reserve from network");
        }
      }
      fee = fee.plus(ownerReserve);
    } else if (inner.TransactionType === "EscrowFinish" && inner.Fulfillment !== undefined && inner.Fulfillment !== null) {
      if (typeof inner.Fulfillment !== "string" || !/^(?:[A-Fa-f0-9]{2})*$/.test(inner.Fulfillment)) {
        throw new Error("Invalid EscrowFinish fulfillment");
      }
      fee = fee.plus(baseFee.times(33 + (inner.Fulfillment.length / 32)));
    } else {
      fee = fee.plus(baseFee);
    }
  }

  return fee;
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
