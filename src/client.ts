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
      clientConnections.push(new Connection(server.url, server.type, { logger: options.logger }));
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

export function findConnection(type: string = "regular"): Connection | null {
  // no connection
  if (clientConnections.length === 0) {
    return null;
    // single connection mode
  } else if (clientConnections.length === 1) {
    return clientConnections[0];
  }

  // get connections by type
  let connections = clientConnections.filter((con) => {
    // invalid type, skipping filtering
    if (typeof type !== "string") {
      return true;
    }

    // no types have been setup
    if (con.types.length === 0) {
      return false;
    } else {
      return con.types.includes(type);
    }
  });

  // no any, use all what we have
  if (connections.length === 0) {
    connections = [...clientConnections];
  }

  // get the fastest one
  connections = connections.sort(sortHelperConnections);

  return connections[0];
}

function sortHelperConnections(a: Connection, b: Connection): -1 | 0 | 1 {
  if (a.getLatenceMs() < b.getLatenceMs()) {
    return -1;
  }
  if (a.getLatenceMs() > b.getLatenceMs()) {
    return 1;
  }

  return 0;
}