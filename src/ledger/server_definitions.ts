import * as Client from "../client";
import { Connection } from "../connection";
import { ErrorResponse } from "../models/base_model";
import { ServerDefinitionsResponseResult } from "../models/server_definitions";

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
