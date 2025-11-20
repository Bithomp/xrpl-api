import crypto from "crypto";
import { EventEmitter } from "events";
import { Request, Response, LedgerStream, RIPPLED_API_V1, APIVersion } from "xrpl";
import { StreamType, ledgerTimeToTimestamp } from "./models/ledger";
import { removeUndefined, dropsToXrp } from "./common";
import { sleep, getTimestamp } from "./common/utils";

import * as XRPLConnection from "xrpl/dist/npm/client/connection";

const RECONNECT_TIMEOUT = 1000 * 5; // 5 sec (in ms)
const LEDGER_CLOSED_TIMEOUT = 1000 * 20; // 20 sec (in ms)
const SERVER_INFO_UPDATE_INTERVAL = 1000 * 60 * 5; // 5 min (in ms)

// min and max ledger index window to consider ledger as available,
// used to prevent from requesting unreachable ledgers
const AVAILABLE_LEDGER_INDEX_WINDOW = 1000;

// Set default api version to 1, so it will be compatible with rippled and xahaud servers
export const DEFAULT_API_VERSION = RIPPLED_API_V1;

export interface ConnectionOptions {
  logger?: any;
  timeout?: number; // request timeout
  connectionTimeout?: number;
  networkID?: number;
  apiVersion?: APIVersion; // default is 1, rippled 1.x: [1], rippled 2.x: [1, 2], xahaud: [1]
}

export interface LatencyInfo {
  timestamp: Date;
  delta: number;
}

export interface ConnectionStreamsInfo {
  ledger: number;
  consensus?: number;
  manifests?: number;
  peer_status?: number;
  transactions?: number;
  transactions_proposed?: number;
  server?: number;
  validations?: number;
}

export interface ConnectionAccountsInfo {
  [key: string]: number;
}

class Connection extends EventEmitter {
  private client?: XRPLConnection.Connection | null;
  public readonly url: string;
  public readonly type?: string;
  public types: string[] = [];
  public latency: LatencyInfo[] = [];
  public readonly logger?: any;
  public readonly timeout: number; // request timeout
  public readonly connectionTimeout: number; // connection timeout
  public readonly hash?: string;
  private onlineSince: number | null = null;
  private networkID?: number;
  private apiVersion: APIVersion;
  private serverInfoUpdating: boolean;
  public serverInfo: any = {};
  private shutdown: boolean = false;
  private connectionWatchTimer: any = null;
  public streams: ConnectionStreamsInfo;
  public accounts: ConnectionAccountsInfo;
  private streamsSubscribed: boolean;

  private bindConnectionWatchTimeout = this.connectionWatchTimeout.bind(this);

  public constructor(url: string, type?: string, options: ConnectionOptions = {}) {
    super();

    this.shutdown = false;
    this.url = url;
    this.type = type;
    this.resetTypes();

    this.client = null;
    this.logger = options.logger;
    this.timeout = options.timeout || LEDGER_CLOSED_TIMEOUT;
    this.connectionTimeout = options.connectionTimeout || RECONNECT_TIMEOUT;
    this.hash = crypto.createHash("sha256").update(url).digest("hex");

    if (typeof options.networkID === "number") {
      this.networkID = options.networkID;
    }

    this.apiVersion = options.apiVersion || DEFAULT_API_VERSION;

    this.serverInfoUpdating = false;
    this.serverInfo = null;

    this.streams = {
      ledger: 1,
    };
    this.accounts = {};
    this.streamsSubscribed = false;
  }

  public async connect(): Promise<void> {
    try {
      this.logger?.debug({
        service: "Bithomp::XRPL::Connection",
        function: "connect",
        url: this.url,
        shutdown: this.shutdown,
      });

      this.removeWatchTimer();
      this.removeClient();

      this.client = new XRPLConnection.Connection(
        this.url,
        removeUndefined({ timeout: this.timeout, connectionTimeout: this.connectionTimeout })
      );
      this.setupEmitter();

      await this.client.connect();
      await this.updateServerInfo();
      await this.subscribe();

      // start connection validation timer
      this.connectionValidation("connect");
    } catch (err: any) {
      this.logger?.warn({
        service: "Bithomp::XRPL::Connection",
        function: "connect",
        url: this.url,
        error: err?.message || err?.name || err,
      });

      this.removeWatchTimer();
      this.removeClient();

      // set timer to reconnect, with some delay by watch timeout
      this.connectionWatchTimer = setTimeout(this.bindConnectionWatchTimeout, LEDGER_CLOSED_TIMEOUT);
    }
  }

  public async disconnect(): Promise<void> {
    this.logger?.debug({
      service: "Bithomp::XRPL::Connection",
      function: "disconnect",
      url: this.url,
    });

    this.shutdown = true;

    if (this.isConnected()) {
      await this.unsubscribe();
    }

    this.removeWatchTimer();
    this.removeClient();
  }

  public async request(request: Request, options?: any): Promise<Response | any> {
    const result = await this._request(request, options);

    let validResponse = true;

    // handle mass timeout errors
    if (result?.error) {
      // too many requests
      if (result.error === "slowDown" || result.error === "Unexpected server response: 429") {
        this.logger?.debug({
          service: "Bithomp::XRPL::Connection",
          function: "request",
          url: this.url,
          error: `Received slowdown error, reconnecting...`,
        });

        validResponse = false;
      } else if (result.error === "timeout") {
        // if we have more then 3 timeouts in last 10 requests, reconnect
        const timeouts = this.latency.filter((info) => info.delta >= this.timeout).length;
        if (timeouts >= 3) {
          this.logger?.debug({
            service: "Bithomp::XRPL::Connection",
            function: "request",
            url: this.url,
            error: `Too many timeouts (${timeouts}) in last ${this.latency.length} requests, reconnecting...`,
          });

          validResponse = false;
        }
      } else if (result.error.toLowerCase().startsWith("websocket was closed")) {
        // websocket was closed, reconnect
        this.logger?.debug({
          service: "Bithomp::XRPL::Connection",
          function: "request",
          url: this.url,
          error: "Websocket was closed, reconnecting...",
        });

        validResponse = false;
      }
    }

    if (validResponse) {
      // trigger connectionValidation to as we have response
      // Xahau could be delayed with ledgerClosed event stream
      if (result?.error !== "notConnected") {
        this.connectionValidation("request");
      }
    } else {
      // this connection is not stable, remove client to force reconnect
      this.removeClient();
    }

    return result;
  }

  async _request(request: Request, options?: any): Promise<Response | any> {
    try {
      if (
        options?.skip_subscription_update !== true &&
        (request.command === "subscribe" || request.command === "unsubscribe")
      ) {
        // we will send request from subscribeStreams and unsubscribeStreams
        return this.updateSubscriptions(request);
      }

      // Check connection after updateSubscriptions to make sure we will not miss any streams update.
      const waitTime = getTimestamp() + RECONNECT_TIMEOUT;
      while (!this.client || !this.isConnected()) {
        // Give it time to reconnect
        await sleep(100);

        // check if connection is shutdown, there is no way to be connected again
        if (this.shutdown) {
          return { error: "shutdownConnection", error_message: "Connection is shutdown.", status: "error" };
        }

        // check if we are waiting too long
        if (getTimestamp() > waitTime) {
          return { error: "notConnected", error_message: "Not connected.", status: "error" };
        }
      }

      const startTimestamp = getTimestamp();

      // check apiVersion, if not present in original request or if different from DEFAULT_API_VERSION
      // add apiVersion to request
      // NOTE: this will mutate the request object
      if (this.apiVersion && !request.hasOwnProperty("api_version") && DEFAULT_API_VERSION !== this.apiVersion) {
        request.api_version = this.apiVersion;
      }

      // NOTE: Use this.client.connection.request(request); instead of this.client.request(request);
      // To prevent xrpl.js to mutate the response object by handlePartialPayment
      const response = await this.client.request(request);

      this.updateLatency(getTimestamp() - startTimestamp);

      return response;
    } catch (err: any) {
      // update latency, as we have error
      this.updateLatency(err.name === "TimeoutError" ? this.timeout : this.connectionTimeout);
      this.logger?.debug({
        service: "Bithomp::XRPL::Connection",
        function: "request",
        url: this.url,
        error: err?.message || err?.name || err,
      });

      // TimeoutError
      if (err.name === "TimeoutError") {
        return { error: "timeout", error_message: "Request timeout.", status: "error" };
      } else if (err.data) {
        return err.data;
      } else {
        return { error: err?.message || err?.name || err, status: "error" };
      }
    }
  }

  public async submit(transaction: string): Promise<Response | any> {
    try {
      return await this.request({ command: "submit", tx_blob: transaction });
    } catch (err: any) {
      this.logger?.debug({
        service: "Bithomp::XRPL::Connection",
        function: "submit",
        url: this.url,
        error: err?.message || err?.name || err,
      });

      if (err.data) {
        return err.data;
      } else {
        return { error: err?.message || err?.name || err };
      }
    }
  }

  public isConnected(): boolean {
    if (!this.client) {
      return false;
    }

    if (!this.client.isConnected()) {
      return false;
    }

    return true;
  }

  public getOnlinePeriodMs(): number | null {
    if (this.isConnected()) {
      return this.onlineSince ? getTimestamp() - this.onlineSince : 0;
    }

    return null;
  }

  public getLatencyMs(): number {
    return this.latency.map((info) => info.delta).reduce((a, b) => a + b, 0) / this.latency.length || 0;
  }

  public getNetworkID(): number | undefined {
    if (typeof this.serverInfo?.network_id === "number") {
      return this.serverInfo.network_id;
    }

    return this.networkID;
  }

  public isLedgerIndexAvailable(ledgerIndex: any): boolean {
    // only for numbered ledger index
    if (typeof ledgerIndex !== "number") {
      return true;
    }

    // we don't have serverInfo to make sure ledger is available
    if (!this.serverInfo?.complete_ledgers) {
      return true;
    }

    // check if ledger is in complete_ledgers
    const completeLedgers = this.serverInfo.complete_ledgers.split("-");

    // complete_ledgers is not valid
    if (completeLedgers.length !== 2) {
      return true;
    }
    completeLedgers[0] = parseInt(completeLedgers[0], 10); // min
    completeLedgers[1] = parseInt(completeLedgers[1], 10); // max

    // check if ledger is in available windows
    if (
      ledgerIndex < completeLedgers[0] - AVAILABLE_LEDGER_INDEX_WINDOW ||
      ledgerIndex > completeLedgers[1] + AVAILABLE_LEDGER_INDEX_WINDOW
    ) {
      return false;
    }

    return true;
  }

  public isLedgerIndexPresent(ledgerIndex: any): boolean {
    // only for numbered ledger index
    if (typeof ledgerIndex !== "number") {
      return true;
    }

    // we don't have serverInfo to make sure ledger is available
    if (!this.serverInfo?.complete_ledgers) {
      return false;
    }

    // check if ledger is in complete_ledgers
    const completeLedgers = this.serverInfo.complete_ledgers.split("-");

    // complete_ledgers is not valid
    if (completeLedgers.length !== 2) {
      return true;
    }
    completeLedgers[0] = parseInt(completeLedgers[0], 10); // min
    completeLedgers[1] = parseInt(completeLedgers[1], 10); // max

    // check if ledger is in available windows
    if (ledgerIndex < completeLedgers[0] || ledgerIndex > completeLedgers[1]) {
      return false;
    }

    return true;
  }

  private updateLatency(delta: number): void {
    this.latency.push({
      timestamp: new Date(),
      delta,
    });

    this.latency.splice(0, this.latency.length - 10);
  }

  private async reconnect(): Promise<void> {
    this.logger?.debug({
      service: "Bithomp::XRPL::Connection",
      function: "reconnect",
      url: this.url,
      shutdown: this.shutdown,
    });

    if (this.shutdown) {
      return;
    }

    this.emit("reconnect");
    try {
      this.removeClient();

      // reset dependent states
      this.resetTypes();
      this.serverInfoUpdating = false;
      this.onlineSince = 0;
      this.serverInfo = null;
      this.streamsSubscribed = false;

      await this.connect();
    } catch (e: any) {
      this.logger?.warn({
        service: "Bithomp::XRPL::Connection",
        function: "reconnect",
        url: this.url,
        error: e.message,
      });

      this.connectionValidation("reconnect");
    }
  }

  private removeClient(code = 1000): void {
    try {
      if (this.client) {
        this.client.removeAllListeners();
        this.client.disconnect();
        this.client = undefined;

        this.emit("disconnected", code);
      }
    } catch (_err: any) {
      // ignore
    }
  }

  private removeWatchTimer(): void {
    if (this.connectionWatchTimer !== null) {
      clearTimeout(this.connectionWatchTimer);
      this.connectionWatchTimer = null;
    }
  }

  private setupEmitter(): void {
    if (!this.client) {
      return;
    }

    this.client.on("connected", () => {
      this.logger?.debug({
        service: "Bithomp::XRPL::Connection",
        emit: "connected",
        url: this.url,
      });

      this.emit("connected");
      this.onlineSince = getTimestamp();
    });

    this.client.on("disconnected", (code) => {
      this.logger?.debug({
        service: "Bithomp::XRPL::Connection",
        emit: "disconnected",
        code,
        url: this.url,
      });

      if (this.client) {
        this.client.removeAllListeners();
        this.client = undefined;
      }

      this.emit("disconnected", code);
    });

    this.client.on("error", (source, message, error) => {
      try {
        // force XRPLConnection to handle correct noPermission errors
        if (source === "noPermission") {
          if (!error.status) {
            error.status = "error";
          }

          if (this.client) {
            (this.client as any).requestManager.handleResponse(error);
            return;
          }
        }

        this.logger?.error({
          service: "Bithomp::XRPL::Connection",
          emit: "error",
          source,
          url: this.url,
          error: message || error?.name || error,
        });

        this.emit("error", source, message, error);
      } catch (err: any) {
        this.logger?.warn({
          service: "Bithomp::XRPL::Connection",
          emit: "error",
          url: this.url,
          error: err?.message || err?.name || err,
        });
      }
    });

    this.client.on("ledgerClosed", (ledgerStream) => {
      this.onLedgerClosed(ledgerStream);

      this.emit("ledgerClosed", ledgerStream);
    });

    this.client.on("transaction", (transactionStream) => {
      this.emit("transaction", transactionStream);
    });

    this.client.on("validationReceived", (validation) => {
      this.emit("validationReceived", validation);
    });

    this.client.on("manifestReceived", (manifest) => {
      this.emit("manifestReceived", manifest);
    });

    this.client.on("peerStatusChange", (status) => {
      this.emit("peerStatusChange", status);
    });

    this.client.on("consensusPhase", (consensus) => {
      this.emit("consensusPhase", consensus);
    });

    this.client.on("path_find", (path) => {
      this.emit("path_find", path);
    });
  }

  private resetTypes(): void {
    if (typeof this.type === "string") {
      this.types = this.type.split(",").map((v) => v.trim());
    } else {
      this.types = [];
    }
  }

  private async updateSubscriptions(request: any): Promise<Response | any> {
    if (request.command === "subscribe") {
      const addStreams: StreamType[] = [];
      const addAccounts: string[] = [];

      if (request.streams) {
        for (const stream of request.streams) {
          if (this.streams[stream] === undefined) {
            this.streams[stream] = 1;
            addStreams.push(stream);
          } else if (stream !== "ledger") {
            this.streams[stream]++;
          }
        }
      }

      if (request.accounts) {
        for (const account of request.accounts) {
          if (this.accounts[account] === undefined) {
            this.accounts[account] = 1;
            addAccounts.push(account);
          } else {
            this.accounts[account]++;
          }
        }
      }

      if (addStreams.length > 0 || addAccounts.length > 0) {
        return await this.subscribe(addStreams, addAccounts);
      }
    } else if (request.command === "unsubscribe") {
      const removeStreams: StreamType[] = [];
      const removeAccounts: string[] = [];

      if (request.streams) {
        for (const stream of request.streams) {
          if (this.streams[stream] === undefined) {
            continue;
          }

          if (stream !== "ledger") {
            this.streams[stream]--;
          }

          if (this.streams[stream] === 0) {
            delete this.streams[stream];
            removeStreams.push(stream);
          }
        }
      }

      if (request.accounts) {
        for (const account of request.accounts) {
          if (this.accounts[account] === undefined) {
            continue;
          }

          this.accounts[account]--;
          if (this.accounts[account] === 0) {
            delete this.accounts[account];
            removeAccounts.push(account);
          }
        }
      }

      if (removeStreams.length > 0 || removeAccounts.length > 0) {
        return await this.unsubscribe(removeStreams, removeAccounts);
      }
    }

    return { status: "success" };
  }

  private async subscribe(streams?: StreamType[], accounts?: string[]): Promise<Response | any> {
    if (this.shutdown) {
      return { error: "shutdownConnection", error_message: "Connection is shutdown.", status: "error" };
    }

    // subscribed and no need to subscribe to new streams
    if (this.streamsSubscribed === true && streams === undefined && accounts === undefined) {
      return { status: "success" };
    }

    streams = streams || (Object.keys(this.streams) as StreamType[]); // eslint-disable-line no-param-reassign
    accounts = accounts || Object.keys(this.accounts); // eslint-disable-line no-param-reassign

    const request: any = { command: "subscribe" };
    if (streams.length > 0) {
      request.streams = streams;
    }

    if (accounts.length > 0) {
      request.accounts = accounts;
    }

    const result = await this.request(request, { skip_subscription_update: true });

    if (result.result && !result.error) {
      this.streamsSubscribed = true;
    }

    return result;
  }

  private async unsubscribe(streams?: StreamType[], accounts?: string[]): Promise<Response | any> {
    // unsubscribed and no need to unsubscribe from new streams
    if (streams === undefined && accounts === undefined) {
      this.streamsSubscribed = false;
    }

    streams = streams || (Object.keys(this.streams) as StreamType[]); // eslint-disable-line no-param-reassign
    accounts = accounts || Object.keys(this.accounts); // eslint-disable-line no-param-reassign

    const request: any = { command: "unsubscribe" };
    if (streams.length > 0) {
      request.streams = streams;
    }

    if (accounts.length > 0) {
      request.accounts = accounts;
    }

    return await this.request(request, { skip_subscription_update: true });
  }

  private onLedgerClosed(ledgerStream: LedgerStream): void {
    const time: number = getTimestamp();
    const ledgerTime: number = ledgerTimeToTimestamp(ledgerStream.ledger_time);

    // ledgerTime could be more then current time
    if (ledgerTime < time) {
      this.updateLatency(time - ledgerTime);
    }

    // update complete_ledgers
    if (this.serverInfo) {
      this.serverInfo.complete_ledgers = ledgerStream.validated_ledgers;

      // update server validated_ledger
      if (this.serverInfo.validated_ledger) {
        // The time since the ledger was closed, in seconds.
        this.serverInfo.validated_ledger.age = Math.round((time - ledgerTime) / 1000);

        this.serverInfo.validated_ledger.seq = ledgerStream.ledger_index;
        this.serverInfo.validated_ledger.hash = ledgerStream.ledger_hash;
        this.serverInfo.validated_ledger.base_fee_xrp = dropsToXrp(ledgerStream.fee_base);
        this.serverInfo.validated_ledger.reserve_base_xrp = dropsToXrp(ledgerStream.reserve_base);
        this.serverInfo.validated_ledger.reserve_inc_xrp = dropsToXrp(ledgerStream.reserve_inc);
      }

      const serverInfoTime = new Date(this.serverInfo.time).getTime();
      if (serverInfoTime + SERVER_INFO_UPDATE_INTERVAL < time) {
        this.updateServerInfo();
      }
    } else {
      this.updateServerInfo();
    }

    this.connectionValidation("ledgerClosed");
  }

  private async updateServerInfo(): Promise<void> {
    if (this.serverInfoUpdating || this.shutdown) {
      return;
    }
    this.serverInfoUpdating = true;

    try {
      const serverInfo = await this.request({ command: "server_info" });
      if (serverInfo?.result?.info) {
        this.serverInfo = serverInfo.result.info;

        // set type as clio
        if (typeof this.serverInfo?.clio_version === "string") {
          if (!this.types.includes("clio")) {
            this.types.push("clio");
          }
        } else {
          // remove type as clio
          const index = this.types.indexOf("clio");
          if (index !== -1) {
            this.types.splice(index, 1);
          }
        }
      }
    } catch (_err: any) {
      // ignore
    }

    this.serverInfoUpdating = false;
  }

  private connectionValidation(event: string): void {
    this.logger?.debug({
      service: "Bithomp::XRPL::Connection",
      function: "connectionValidation",
      event,
      url: this.url,
      shutdown: this.shutdown,
    });

    this.removeWatchTimer();

    if (this.shutdown) {
      this.removeClient();
      return;
    }

    // start connection watch timer
    this.connectionWatchTimer = setTimeout(this.bindConnectionWatchTimeout, LEDGER_CLOSED_TIMEOUT);

    if (this.streamsSubscribed === false) {
      this.subscribe();
    }

    if (this.serverInfo === null && this.isConnected()) {
      this.updateServerInfo();
    }
  }

  private async connectionWatchTimeout(): Promise<void> {
    this.logger?.debug({
      service: "Bithomp::XRPL::Connection",
      function: "connectionWatchTimeout",
      url: this.url,
      timeout: LEDGER_CLOSED_TIMEOUT,
      shutdown: this.shutdown,
    });

    this.connectionWatchTimer = null;

    this.updateLatency(LEDGER_CLOSED_TIMEOUT);
    try {
      await this.reconnect();
    } catch (e: any) {
      this.logger?.warn({
        service: "Bithomp::XRPL::Connection",
        function: "connectionWatchTimeout",
        url: this.url,
        error: e.message,
      });

      // set timer to reconnect by watch timeout
      this.connectionWatchTimer = setTimeout(this.bindConnectionWatchTimeout, RECONNECT_TIMEOUT);
    }
  }
}

export { Connection };
