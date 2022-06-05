import * as Client from "../client";
import { Connection } from "../connection";

export interface GetServerInfoOptions {
  url?: string;
  type?: string;
  connection?: Connection;
}

/**
 * @returns {string | null}
 * @exception {Error}
 */
export async function getServerInfo(options: GetServerInfoOptions = {}): Promise<object | null> {
  const connection: any = options.connection || Client.findConnection(options.type, options.url, true);
  if (!connection) {
    throw new Error("There is no connection");
  }

  const response: any = await connection.request({
    command: "server_info",
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
