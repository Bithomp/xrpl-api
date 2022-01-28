import * as Client from "../client";

export interface GetTransactionOptions {
  binary?: boolean;
  minLedgerVersion?: number;
  maxLedgerVersion?: number;
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
export async function getTransactionAsync(
  transaction: string,
  options: GetTransactionOptions = {}
): Promise<object | null> {
  const connection: any = Client.findConnection();
  if (!connection) {
    throw new Error("There is no connection");
  }

  await connection.connect();
  const response = await connection.request({
    command: "tx",
    transaction,
    binary: !!options.binary,
    minLedgerVersion: options.minLedgerVersion,
    maxLedgerVersion: options.maxLedgerVersion,
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

  return response?.result;
}
