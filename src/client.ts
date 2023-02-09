import { Connection, ConnectionOptions } from "./connection";

export * from "./ledger";
export let feeCushion: number = 1.3;
export let logger: any;

let clientConnections: Connection[] = [];

export interface ClientOptions extends ConnectionOptions {
  feeCushion?: number;
  maxFeeXRP?: string;
  logger?: any;
}

export interface ClientConnection {
  url: string;
  type?: string;
  timeout?: number; // request timeout
  connectionTimeout?: number;
}

export function setup(servers: ClientConnection[], options: ClientOptions = {}) {
  logger = options.logger;

  logger?.debug({
    service: "Bithomp::XRPL::Client",
    function: "setup",
  });

  // servers has to be initiated only once
  if (servers) {
    // reset list of connections
    disconnect();
    clientConnections = [];
    for (const server of servers) {
      clientConnections.push(
        new Connection(server.url, server.type, {
          logger: options.logger,
          timeout: server.timeout,
          connectionTimeout: server.connectionTimeout,
        })
      );
    }
  }

  if (options.feeCushion) {
    feeCushion = options.feeCushion;
  }
}

export async function connect() {
  logger?.debug({
    service: "Bithomp::XRPL::Client",
    function: "connect",
  });

  for (const connection of clientConnections) {
    await connection.connect();
  }
}

export function disconnect() {
  logger?.debug({
    service: "Bithomp::XRPL::Client",
    function: "disconnect",
  });

  for (const connection of clientConnections) {
    connection.disconnect();
  }
}

/**
 * @returns {Connection | null}
 */
export function findConnection(type?: string, url?: string, strongFilter?: boolean, hash?: string): Connection | null {
  if (!strongFilter) {
    // no connection
    if (clientConnections.length === 0) {
      return null;
      // single connection mode
    } else if (clientConnections.length === 1) {
      return clientConnections[0];
    }
  }

  // get connections by type
  let connections = clientConnections.filter((con) => {
    if (!con.isConnected()) {
      return false;
    }

    if (typeof url === "string" && con.url !== url) {
      return false;
    }

    if (typeof hash === "string" && con.hash !== hash) {
      return false;
    }

    // invalid type, skipping filtering
    if (typeof type !== "string") {
      return true;
    }

    if (con.types.length === 0) {
      return false;
    }

    // check which types are supported
    const foundTypes = type.split(",").map((t) => {
      t = t.trim();
      if (t[0] === "!") {
        return !con.types.includes(t.slice(1));
      } else {
        return con.types.includes(t);
      }
    });

    // check if all types are supported
    for (const found of foundTypes) {
      if (!found) {
        return false;
      }
    }

    return true;
  });

  if (!strongFilter) {
    // no any, use all what we have
    if (connections.length === 0) {
      connections = [...clientConnections];
    }
  }

  // get the fastest one
  connections = connections.sort(sortHelperConnections);

  return connections[0];
}

function sortHelperConnections(a: Connection, b: Connection): -1 | 0 | 1 {
  if (a.getLatencyMs() < b.getLatencyMs()) {
    return -1;
  }
  if (a.getLatencyMs() > b.getLatencyMs()) {
    return 1;
  }

  return 0;
}
