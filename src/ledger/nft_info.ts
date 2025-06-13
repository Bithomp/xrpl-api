import * as Client from "../client";
import { ErrorResponse } from "../models/base_model";
import { removeUndefined } from "../common/utils";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface GetNftInfoOptions { }

/**
 * @returns {Promise<object | ErrorResponse>}
 * @exception {Error}
 */
export async function getNftInfo(nft_id: string, _options: GetNftInfoOptions = {}): Promise<object | ErrorResponse> {
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
    const { error, error_code, error_message, error_exception, status, validated } = response;

    return removeUndefined({
      error,
      error_code,
      error_message,
      error_exception,
      status,
      validated,
    });
  }

  return response?.result;
}
