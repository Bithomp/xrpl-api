import { BigNumber } from "bignumber.js";
import { encode, XrplDefinitionsBase } from "ripple-binary-codec";

import * as Client from "../client";
import { Connection } from "../connection";
import { dropsInXRP } from "../common";

export interface GetFeeOptions {
  connection?: Connection;
  tx?: any;
  definitions?: XrplDefinitionsBase;
}

/**
 * @returns {string | null}
 * @exception {Error}
 */
export async function getFee(options: GetFeeOptions = {}): Promise<string | null> {
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

  const openLedgerFee: any = response?.result?.drops?.open_ledger_fee;
  if (!openLedgerFee) {
    return null;
  }

  const fee: any = new BigNumber(openLedgerFee)
    .multipliedBy(Client.feeCushion)
    .dividedBy(dropsInXRP)
    .decimalPlaces(6, BigNumber.ROUND_UP);

  return fee.toString();
}
