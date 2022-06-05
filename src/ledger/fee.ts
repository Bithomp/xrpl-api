import { BigNumber } from "bignumber.js";

import * as Client from "../client";
import { Connection } from "../connection";
import { dropsInXRP } from "../common";

export interface GetFeeOptions {
  connection?: Connection;
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

  const response: any = await connection.request({
    command: "fee",
  });

  const baseFee: any = response?.result?.drops?.base_fee;

  if (!baseFee) {
    return null;
  }

  const fee: any = new BigNumber(baseFee).multipliedBy(Client.feeCushion).dividedBy(dropsInXRP);

  return fee.toString();
}
