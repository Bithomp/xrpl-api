import * as Client from "../client";

export interface GetNftInfoOptions {}

/**
 * @returns {string | null}
 * @exception {Error}
 */
export async function getNftInfo(nft_id: string, options: GetNftInfoOptions = {}): Promise<object | null> {
  // strong search only Clio servers support the command
  const connection: any = Client.findConnection("clio", undefined, true);
  if (!connection) {
    throw new Error("There is no connection");
  }

  const response: any = await connection.request({
    command: "nft_info",
    nft_id,
  });

  if (!response) {
    return null;
  }

  if (response.error) {
    const { error, error_code, error_message, status, validated } = response;

    return {
      error,
      error_code,
      error_message,
      status,
      validated,
    };
  }

  return response?.result;
}
