import * as Client from "../client";
import { Connection } from "../connection";
import { ErrorResponse } from "../models/base_model";
import { ServerDefinitionsResponseResult } from "../models/server_definitions";
import { removeUndefined } from "../common/utils";

export interface GetServerDefinitionsOptions {
  connection?: Connection;
}

/**
 * @returns {string | null}
 * @exception {Error}
 */
export async function getServerDefinitions(
  options: GetServerDefinitionsOptions = {}
): Promise<ServerDefinitionsResponseResult | ErrorResponse> {
  const connection: any = options.connection || Client.findConnection();
  if (!connection) {
    throw new Error("There is no connection");
  }

  const response: any = await connection.request({
    command: "server_definitions",
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
