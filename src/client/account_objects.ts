import * as Client from "../client";

export interface GetAccountObjectsOptions {
  type?: string | ("check" | "escrow" | "offer" | "payment_channel" | "signer_list" | "state");
  ledgerHash?: string;
  ledgerIndex?: number | ("validated" | "closed" | "current");
  limit?: number;
  marker?: string;
}

/**
[
  {
    "Balance": {
      "currency": "FOO",
      "issuer": "rrrrrrrrrrrrrrrrrrrrBZbvji",
      "value": "-123.45"
    },
    "Flags": 131072,
    "HighLimit": {
      "currency": "FOO",
      "issuer": "rLRUyXNh6QNmkdR1xJrnJBGURQeNp9Ltyf",
      "value": "1000000000"
    },
    "HighNode": "0",
    "LedgerEntryType": "RippleState",
    "LowLimit": {
      "currency": "FOO",
      "issuer": "rNTvdxPWujQn2sUXYBGxmWrGe4ethkLyhb",
      "value": "0"
    },
    "LowNode": "0",
    "PreviousTxnID": "682BC63E6B3A17304301D921383516F4EF5F4A521B170EAF8492486B21D638FD",
    "PreviousTxnLgrSeq": 22442930,
    "index": "7A130F5FC6D937B65545220DC483B918A4A137D918EF2F126ECD4CBBFE44A633"
  }
]
*/
export async function getAccountObjectsAsync(account: string, options: GetAccountObjectsOptions = {}) {
  const connection: any = Client.findConnection();
  if (!connection) {
    throw new Error("There is no connection");
  }

  await connection.connect();
  const response = await connection.request({
    command: "account_objects",
    account,
    type: options.type,
    ledger_hash: options.ledgerHash,
    ledger_index: options.ledgerIndex,
    limit: options.limit,
    marker: options.marker,
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

  return response?.result?.account_objects;
}
