import * as Client from "../client";
import { Connection } from "../connection";
import { ErrorResponse } from "../models/base_model";
import { removeUndefined } from "../common/utils";

export interface GetServerInfoOptions {
  url?: string;
  type?: string;
  connection?: Connection;
}

/**
 * @returns {Promise<object | ErrorResponse>}
 * @exception {Error}
 */
export async function getServerInfo(options: GetServerInfoOptions = {}): Promise<object | ErrorResponse> {
  const connection: any = options.connection || Client.findConnection(options.type, options.url, true);
  if (!connection) {
    throw new Error("There is no connection");
  }

  const response: any = await connection.request({
    command: "server_info",
  });

  if (!response) {
    return {
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
