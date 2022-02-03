import { BigNumber } from "bignumber.js";

import * as Client from "../client";

/**
 * @returns {string | null}
 * @exception {Error}
 */
export async function getFee(): Promise<string | null> {
  const connection: any = Client.findConnection();
  if (!connection) {
    throw new Error("There is no connection");
  }

  await connection.connect();

  const response: any = await connection.request({
    command: "fee",
  });

  const baseFee: any = response?.result?.drops?.base_fee;

  if (!baseFee) {
    return null;
  }

  const fee: any = new BigNumber(baseFee).multipliedBy(Client.feeCushion).dividedBy(Client.dropsInXRP);

  return fee.toString();
}
