import * as Client from "../client";

export interface GetTrustlinesOptions {
  counterparty?: string
  currency?: string
  ledgerVersion?: number | ("validated" | "closed" | "current");
  limit?: number;
}

/**
[
  {
    account: "rNTvdxPWujQn2sUXYBGxmWrGe4ethkLyhb",
    balance: "123.45",
    currency: "FOO",
    limit: "1000000000",
    limit_peer: "0",
    no_ripple: false,
    no_ripple_peer: false,
    quality_in: 0,
    quality_out: 0,
  },
]
*/
export async function getTrustlinesAsync(account: string, options: GetTrustlinesOptions = {}) {
  const connection: any = Client.findConnection();
  if (!connection) {
    throw new Error("There is no connection");
  }

  await connection.connect();
  const response = await connection.request({
    command: "account_lines",
    account,
    counterparty: options.counterparty,
    currency: options.currency,
    ledger_index: options.ledgerVersion,
    limit: options.limit,
  });

  if (!response) {
    return null;
  }

  if (response.error) {
    const { error, error_code, error_message, status, validated } = response;

    return {
      account,
      error,
      error_code,
      error_message,
      status,
      validated,
    };
  }

  return response?.result?.lines;
}
