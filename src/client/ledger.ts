import * as Client from "../client";

export interface GetLedgerOptions {
  ledgerVersion?: number | string;
  includeTransactions?: boolean;
  includeAllData?: boolean;
}

/**
{
  accepted: true,
  account_hash: 'D240A9A26FB9780A195B7B77E78262078CE916F7E5C16582BD617E6C96CA7B51',
  close_flags: 0,
  close_time: 686730951,
  close_time_human: '2021-Oct-05 06:35:51.000000000 UTC',
  close_time_resolution: 10,
  closed: true,
  hash: 'E5C1E68EED45C6A72B9BA777AC9BA08F3D34C23D42B52B19276C3E2F5E9E1EFC',
  ledger_hash: 'E5C1E68EED45C6A72B9BA777AC9BA08F3D34C23D42B52B19276C3E2F5E9E1EFC',
  ledger_index: '66816622',
  parent_close_time: 686730950,
  parent_hash: 'BA24C903D19BB23080810ECF854FA1AC2612E1C36A00E0903A9EF68C77336C4E',
  seqNum: '66816622',
  totalCoins: '99990201296815002',
  total_coins: '99990201296815002',
  transaction_hash: '14317D710ABE357DE559D8519C864103D25361BA7EAF9DE3699556AEF5975463'
}
*/
export async function getLedgerAsync(options: GetLedgerOptions = {}) {
  const connection: any = Client.findConnection("history");
  if (!connection) {
    console.warn(`There is no connection`);
    return null;
  }

  await connection.connect();
  const response: any = await connection.request({
    command: "ledger",
    ledger_index: options.ledgerVersion ? options.ledgerVersion : "validated",
    transactions: !!options.includeTransactions,
    expand: !!options.includeAllData,
  });

  return response?.result?.ledger;
}
