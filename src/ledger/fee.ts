import BigNumber from "bignumber.js";
import { encode, XrplDefinitionsBase } from "ripple-binary-codec";

import * as Client from "../client";
import { Connection } from "../connection";
import { dropsInXRP, removeUndefined } from "../common";
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

  let txBlob: string | undefined;
  if (typeof options.tx === "string") {
    txBlob = options.tx;
  } else if (typeof options.tx === "object") {
    txBlob = encode(options.tx, options.definitions);
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
    fee: fee.toString(),
  };
}

/**
 * @returns {string | null}
 * @exception {Error}
 */
export async function getFee(options: GetFeeOptions = {}): Promise<string | null> {
  const response = await getFeeData(options);
  if ("fee" in response) {
    return response.fee;
  }

  return null;
}
