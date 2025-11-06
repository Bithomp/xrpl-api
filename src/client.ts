import { Connection, ConnectionOptions } from "./connection";
import { MAINNET_NATIVE_CURRENCY } from "./common";
import { LedgerIndex } from "./models/ledger";

export * from "./ledger";
export let feeCushion: number = 1.3; // 30% fee cushion
export let logger: any;

let clientConnections: Connection[] = [];
let loadBalancing = false;
let nativeCurrency = MAINNET_NATIVE_CURRENCY;

export interface ClientOptions extends ConnectionOptions {
  feeCushion?: number;
  maxFeeXRP?: string;
  logger?: any;
  nativeCurrency?: "XRP" | "XAH";

  // EXPERIMENTAL
  loadBalancing?: boolean; // false - use only fastest connection, true - use next connection on each request, as each request could have each own possible connections, balancing will pick random connection
}

export interface ClientConnection {
  url: string;
  type?: string;
  timeout?: number; // request timeout
  connectionTimeout?: number;
  networkID?: number;
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
          networkID: server.networkID,
          apiVersion: options.apiVersion,
        })
      );
    }
  }

  if (options.feeCushion) {
    feeCushion = options.feeCushion;
  }

  if (options.nativeCurrency) {
    nativeCurrency = options.nativeCurrency;
  }

  loadBalancing = options.loadBalancing === true;
}

export async function connect() {
  logger?.debug({
    service: "Bithomp::XRPL::Client",
    function: "connect",
  });

  await Promise.all(
    clientConnections.map(async (connection) => {
      await connection.connect();
    })
  );
}

export async function disconnect() {
  logger?.debug({
    service: "Bithomp::XRPL::Client",
    function: "disconnect",
  });

  await Promise.all(
    clientConnections.map(async (connection) => {
      await connection.disconnect();
    })
  );
}

export function getNativeCurrency() {
  return nativeCurrency || MAINNET_NATIVE_CURRENCY;
}

/**
 * @returns {Connection | null}
 */
export function findConnection(
  type?: string,
  url?: string,
  strongFilter?: boolean,
  hash?: string,
  networkID?: number
): Connection | null {
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

    // networkID could be missed on old rippled or clio
    if (typeof networkID === "number" && typeof con.getNetworkID() === "number") {
      if (con.getNetworkID() !== networkID) {
        return false;
      }
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
      t = t.trim(); // eslint-disable-line no-param-reassign
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

  if (strongFilter === undefined || strongFilter === false) {
    // no any, use all what we have connected to requested network
    if (connections.length === 0) {
      connections = clientConnections.filter((con) => {
        if (!con.isConnected()) {
          return false;
        }

        // networkID could be missed on old rippled or clio
        if (typeof networkID === "number" && typeof con.getNetworkID() === "number") {
          if (con.getNetworkID() !== networkID) {
            return false;
          }
        }

        return true;
      });
    }
  }

  if (connections.length === 0) {
    return null;
  } else if (connections.length === 1) {
    return connections[0];
  }

  if (loadBalancing) {
    // pick next connection randomly
    const index = Math.floor(Math.random() * connections.length);
    return connections[index];
  }

  // get the fastest one
  connections = connections.sort(sortHelperConnections);

  return connections[0];
}

export function findConnectionByLedger(
  ledgerIndex?: LedgerIndex,
  ledgerHash?: string,
  networkID?: number
): Connection | null {
  // if hash is provided, use it to find connection
  if (ledgerHash) {
    return findConnection("history", undefined, false, undefined, networkID);
  }

  if (typeof ledgerIndex === "string" || ledgerIndex === undefined) {
    // any connection is fine
    return findConnection(undefined, undefined, false, undefined, networkID);
  }

  // find connection which has requested ledger index available
  const availableConnections = clientConnections.filter((con) => {
    if (!con.isConnected()) {
      return false;
    }

    // networkID could be missed on old rippled or clio
    if (typeof networkID === "number" && typeof con.getNetworkID() === "number") {
      if (con.getNetworkID() !== networkID) {
        return false;
      }
    }

    return con.isLedgerIndexPresent(ledgerIndex);
  });

  if (availableConnections.length === 0) {
    // retry any connection
    return findConnection(undefined, undefined, false, undefined, networkID);
  } else if (availableConnections.length === 1) {
    return availableConnections[0];
  }

  if (loadBalancing) {
    // pick next connection randomly
    const index = Math.floor(Math.random() * availableConnections.length);
    return availableConnections[index];
  }

  // get the fastest one
  const sortedConnections = availableConnections.sort(sortHelperConnections);

  return sortedConnections[0];
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
