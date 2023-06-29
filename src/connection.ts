import _ from "lodash";
import crypto from "crypto";
import { EventEmitter } from "events";
import { Client, Request, Response, LedgerStream } from "xrpl";
import { StreamType, ledgerTimeToTimestamp } from "./models/ledger";
import { removeUndefined, dropsToXrp } from "./common";

const LEDGER_CLOSED_TIMEOUT = 1000 * 15; // 15 sec
const SERVER_INFO_UPDATE_INTERVAL = 1000 * 60 * 5; // 5 min (in ms)

export interface ConnectionOptions {
  logger?: any;
  timeout?: number; // request timeout
  connectionTimeout?: number;
  networkID?: number;
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
  private client?: Client | null;
  public readonly url: string;
  public readonly type?: string;
  public readonly types: string[];
  public latency: LatencyInfo[];
  public readonly logger?: any;
  public readonly timeout?: number; // request timeout
  public readonly connectionTimeout?: number;
  public readonly hash?: string;
  private networkID?: number;
  private serverInfoUpdating: boolean;
  public serverInfo: any = {};
  private shutdown: boolean = false;
  private connectionTimer: any = null;
  public streams: ConnectionStreamsInfo;
  public accounts: ConnectionAccountsInfo;
  private streamsSubscribed: boolean;

  public constructor(url: string, type?: string, options: ConnectionOptions = {}) {
    super();

    this.shutdown = false;
    this.url = url;
    this.type = type;
    if (typeof this.type === "string") {
      this.types = this.type.split(",").map((v) => v.trim());
    } else {
      this.types = [];
    }

    this.latency = [];
    this.client = null;
    this.logger = options.logger;
    this.timeout = options.timeout; // request timeout
    this.connectionTimeout = options.connectionTimeout;
    this.hash = crypto.createHash("sha256").update(url).digest("hex");

    if (typeof options.networkID === "number") {
      this.networkID = options.networkID;
    }

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
      if (this.client) {
        this.client.disconnect();
      }

      this.client = new Client(
        this.url,
        removeUndefined({ timeout: this.timeout, connectionTimeout: this.connectionTimeout })
      );
      this.setupEmitter();

      await this.client.connect();
      await this.updateServerInfo();
      await this.subscribe();
    } catch (err: any) {
      this.logger?.warn({
        service: "Bithomp::XRPL::Connection",
        function: "connect",
        url: this.url,
        error: err?.message || err?.name || err,
      });
    }

    this.connectionValidation();
  }

  public async disconnect(): Promise<void> {
    this.shutdown = true;

    await this.unsubscribe();
    await this.client?.disconnect();
    delete this.client;
    clearTimeout(this.connectionTimer);
  }

  public async request(request: Request, options?: any): Promise<Response | any> {
    try {
      if (
        options?.skip_subscription_update !== true &&
        (request.command === "subscribe" || request.command === "unsubscribe")
      ) {
        // we will send request from subscribeStreams and unsubscribeStreams
        return this.updateSubscriptions(request);
      }

      // check connection after updateSubscriptions to make sure we will not miss any streams update
      if (!this.client || !this.isConnected()) {
        return { error: "Not connected" };
      }

      const startDate: Date = new Date();
      const response = await this.client.request(request);
      const endDate: Date = new Date();

      this.updateLatency(endDate.getTime() - startDate.getTime());

      return response;
    } catch (err: any) {
      this.updateLatency(1000);
      this.logger?.debug({
        service: "Bithomp::XRPL::Connection",
        function: "request",
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

  public async submit(transaction: string): Promise<Response | any> {
    try {
      return await this.request({ command: "submit", tx_blob: transaction });
    } catch (err: any) {
      this.updateLatency(1000);
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

    return this.client.isConnected();
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

    if (!this.shutdown) {
      this.emit("reconnect");
      try {
        if (this.client) {
          await this.client.disconnect();
        }

        await this.connect();
      } catch (e: any) {
        this.logger?.warn({
          service: "Bithomp::XRPL::Connection",
          function: "reconnect",
          error: e.message,
        });
      }

      this.connectionValidation();
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
    });

    this.client.on("disconnected", (code) => {
      this.logger?.debug({
        service: "Bithomp::XRPL::Connection",
        emit: "disconnected",
        code,
        url: this.url,
      });

      this.serverInfo = null;
      this.streamsSubscribed = false;

      this.emit("disconnected", code);
    });

    this.client.on("error", (source, message, error) => {
      this.logger?.error({
        service: "Bithomp::XRPL::Connection",
        emit: "error",
        source,
        error: message || error?.name || error,
      });

      try {
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

    // this.client.on("manifestReceived", (manifest) => {
    //   this.emit("manifestReceived", manifest);
    // });

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
    // subscribed and no need to subscribe to new streams
    if (this.streamsSubscribed === true && streams === undefined && accounts === undefined) {
      return null;
    }

    streams = streams || (Object.keys(this.streams) as StreamType[]);
    accounts = accounts || Object.keys(this.accounts);

    const request: any = { command: "subscribe" };
    if (streams.length > 0) {
      request.streams = streams;
    }

    if (accounts.length > 0) {
      request.accounts = accounts;
    }

    const result = await this.request(request, { skip_subscription_update: true });

    if (result.result) {
      this.streamsSubscribed = true;
    }

    return result;
  }

  private async unsubscribe(streams?: StreamType[], accounts?: string[]): Promise<Response | any> {
    // unsubscribed and no need to unsubscribe from new streams
    if (streams === undefined && accounts === undefined) {
      this.streamsSubscribed = false;
    }

    streams = streams || (Object.keys(this.streams) as StreamType[]);
    accounts = accounts || Object.keys(this.accounts);

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
    const time: number = new Date().getTime();
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

    this.connectionValidation();
  }

  private async updateServerInfo(): Promise<void> {
    if (this.serverInfoUpdating) {
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
    } catch (error) {
      // ignore
    }

    this.serverInfoUpdating = false;
  }

  private connectionValidation(): void {
    this.logger?.debug({
      service: "Bithomp::XRPL::Connection",
      function: "connectionValidation",
      url: this.url,
      shutdown: this.shutdown,
    });

    if (this.connectionTimer !== null) {
      clearTimeout(this.connectionTimer);
      this.connectionTimer = null;
    }

    if (!this.shutdown) {
      if (this.streamsSubscribed === false) {
        this.subscribe();
      }
      if (this.serverInfo === null) {
        this.updateServerInfo();
      }
      this.connectionTimer = setTimeout(() => {
        this.connectionValidationTimeout();
      }, LEDGER_CLOSED_TIMEOUT);
    } else {
      this.client?.disconnect();
    }
  }

  private async connectionValidationTimeout(): Promise<void> {
    this.logger?.debug({
      service: "Bithomp::XRPL::Connection",
      function: "connectionValidationTimeout",
      url: this.url,
      timeout: LEDGER_CLOSED_TIMEOUT,
      shutdown: this.shutdown,
    });

    this.connectionTimer = null;

    this.updateLatency(LEDGER_CLOSED_TIMEOUT);
    try {
      await this.reconnect();
    } catch (e: any) {
      this.logger?.warn({
        service: "Bithomp::XRPL::Connection",
        function: "connectionValidationTimeout",
        error: e.message,
      });

      this.connectionValidation();
    }
  }
}

export { Connection };
