import { BigNumber } from "bignumber.js";
import * as Client from "../client";

export async function getFeeAsync() {
  const connection: any = Client.findConnection();

  if (!connection) {
    console.warn(`There is no configuration for s1`);
    return null;
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
