import * as Client from "../client";
import { ErrorResponse } from "../models/base_model";

// tslint:disable-next-line:no-empty-interface
export interface GetNftInfoOptions {}

/**
 * @returns {Promise<object | ErrorResponse>}
 * @exception {Error}
 */
// tslint:disable-next-line:variable-name
export async function getNftInfo(nft_id: string, options: GetNftInfoOptions = {}): Promise<object | ErrorResponse> {
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
    return {
      nft_id,
      status: "error",
      error: "invalidResponse",
    };
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
