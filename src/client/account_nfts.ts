import * as Client from "../client";

export interface GetAccountNFTOptions {
  ledgerVersion?: number | string;
}

/**
[
  {
    Flags: 8,
    Issuer: 'rhmfc7GZAJ9j2HuPwBwqCoAJZPai8noFhA',
    TokenID: '00080000294032DF27EE9718B0E16D5E2EC89550730CCDDD0000099B00000000',
    TokenTaxon: 0,
    URI: '697066733A2F2F516D61364C3477474E786B5367475A66415A6F546A457339346A514B4C7A31324338486966523541536D43554135',
    nft_serial: 0
  }
]
*/
export async function getAccountNFTAsync(account: string, options: GetAccountNFTOptions = {}) {
  const connection: any = Client.findConnection();
  if (!connection) {
    console.warn(`There is no connection`);
    return null;
  }

  await connection.connect();
  const response = await connection.request({
    command: "account_nfts",
    account: account,
    ledger_index: options.ledgerVersion || "validated",
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

  return response?.result?.account_nfts;
}
