import * as _ from "lodash";
import { EventEmitter } from "events";
import { Client, Request, Response } from "xrpl";
import { ledgerTimeToTimestamp } from "./ledger/ledger";
import { StreamType } from "./models/ledger_index";

const LEDGER_CLOSED_TIMEOUT = 1000 * 10; // 10 sec

export interface ConnectionOptions {
  logger?: any;
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

class Connection extends EventEmitter {
  public readonly client: Client;
  public readonly url: string;
  public readonly type?: string;
  public readonly types: string[];
  public latency: LatencyInfo[];
  public readonly logger?: any;
  private shotdown: boolean = false;
  private connectionTimer: any = null;
  public streams: ConnectionStreamsInfo;
  private streamsSubscribed: boolean;

  public constructor(url: string, type?: string, options: ConnectionOptions = {}) {
    super();

    this.shotdown = false;
    this.url = url;
    this.type = type;
    if (typeof this.type === "string") {
      this.types = this.type.split(",").map((v) => v.trim());
    } else {
      this.types = [];
    }

    this.latency = [];
    this.client = new Client(url);
    this.logger = options.logger;
    this.streams = {
      ledger: 1,
    };
    this.streamsSubscribed = false;

    this.setupEmitter();
  }

  public async connect(): Promise<void> {
    try {
      await this.client.connect();
      await this.subscribeStreams();
    } catch (e: any) {
      this.logger?.warn({
        service: "Bithomp::XRPL::Connection",
        function: "connect",
        url: this.url,
        error: e.message || e.name || e,
      });
    }

    this.connectionValidation();
  }

  public async disconnect(): Promise<void> {
    this.shotdown = true;

    await this.unsubscribeStreams();
    await this.client.disconnect();
  }

  public async request(request: Request, options?: any): Promise<Response | any> {
    try {
      if (
        options?.skip_streams_update !== true &&
        (request.command === "subscribe" || request.command === "unsubscribe")
      ) {
        // we will send request from subscribeStreams and unsubscribeStreams
        return this.updateSubscribedStreams(request);
      }

      const startDate: Date = new Date();
      const response = await this.client.request(request);
      const endDate: Date = new Date();

      this.updateLatence(endDate.getTime() - startDate.getTime());

      return response;
    } catch (e: any) {
      this.updateLatence(1000);
      this.logger?.debug({
        service: "Bithomp::XRPL::Connection",
        function: "request",
        url: this.url,
        error: e.message || e.name || e,
      });

      if (e.data) {
        return e.data;
      } else {
        return { error: e.message || e.name || e };
      }
    }
  }

  public async submit(transaction: string): Promise<Response | any> {
    try {
      const startDate: Date = new Date();
      const response = await this.client.submit(transaction);
      const endDate: Date = new Date();

      this.updateLatence(endDate.getTime() - startDate.getTime());

      return response;
    } catch (e: any) {
      this.updateLatence(1000);
      this.logger?.debug({
        service: "Bithomp::XRPL::Connection",
        function: "submitAndWait",
        url: this.url,
        error: e.message || e.name || e,
      });

      if (e.data) {
        return e.data;
      } else {
        return { error: e.message || e.name || e };
      }
    }
  }

  public isConnected(): boolean {
    return this.client.isConnected();
  }

  public getLatenceMs(): number {
    return this.latency.map((info) => info.delta).reduce((a, b) => a + b, 0) / this.latency.length || 0;
  }

  private updateLatence(delta: number): void {
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
      shotdown: this.shotdown,
    });

    if (!this.shotdown) {
      this.emit("reconnect");
      try {
        if (this.isConnected()) {
          await this.client.disconnect();
        }

        await this.client.connect();
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
    this.client.on("connected", () => {
      this.logger?.debug({
        service: "Bithomp::XRPL::Connection",
        function: "connected",
        url: this.url,
      });

      this.emit("connected");
    });

    this.client.on("disconnected", () => {
      this.logger?.debug({
        service: "Bithomp::XRPL::Connection",
        function: "disconnected",
        url: this.url,
      });

      this.reconnect();

      this.emit("disconnected");
    });

    this.client.on("error", (e) => {
      this.logger?.error({
        service: "Bithomp::XRPL::Connection",
        function: "error",
        error: e.message || e.name || e,
      });

      this.emit("error", e);
    });

    this.client.on("ledgerClosed", (ledgerStream) => {
      const time: number = new Date().getTime();
      const ledgerTime: number = ledgerTimeToTimestamp(ledgerStream.ledger_time);

      // ledgerTime could be more then current time
      if (ledgerTime < time) {
        this.updateLatence(time - ledgerTime);
      }

      this.connectionValidation();

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

  private async updateSubscribedStreams(request: any): Promise<Response | any> {
    if (request.command === "subscribe") {
      const addStreams: StreamType[] = [];

      for (const stream of request.streams) {
        if (this.streams[stream] === undefined) {
          this.streams[stream] = 1;
          addStreams.push(stream);
        } else if (stream !== "ledger") {
          this.streams[stream]++;
        }
      }

      if (addStreams.length > 0) {
        return await this.subscribeStreams(addStreams);
      }
    } else if (request.command === "unsubscribe") {
      const removeStreams: StreamType[] = [];

      for (const stream of request.streams) {
        if (this.streams[stream] === undefined) {
          continue;
        }

        if (stream !== "ledger") {
          this.streams[stream]--;
        }

        if (this.streams[stream] === 0) {
          removeStreams.push(stream);
          delete this.streams[stream];
        }
      }

      if (removeStreams.length > 0) {
        return await this.unsubscribeStreams(removeStreams);
      }
    }

    return null;
  }

  private async subscribeStreams(addStreams?: StreamType[]): Promise<Response | any> {
    const streams: StreamType[] = addStreams || (Object.keys(this.streams) as StreamType[]);

    // subscribed and no need to subscribe to new streams
    if (this.streamsSubscribed === true && addStreams === undefined) {
      return null;
    }

    if (addStreams === undefined) {
      this.streamsSubscribed = true;
    }

    const result = await this.request({ command: "subscribe", streams }, { skip_streams_update: true });

    // subscribtion failed
    if (addStreams === undefined && !result.result) {
      this.streamsSubscribed = false;
    }

    return result;
  }

  private async unsubscribeStreams(removeStreams?: StreamType[]): Promise<Response | any> {
    const streams: StreamType[] = removeStreams || (Object.keys(this.streams) as StreamType[]);

    // unsubsribed and no need to unsubscribe from new streams
    if (removeStreams === undefined) {
      this.streamsSubscribed = false;
    }

    return await this.request({ command: "unsubscribe", streams }, { skip_streams_update: true });
  }

  private connectionValidation(): void {
    this.logger?.debug({
      service: "Bithomp::XRPL::Connection",
      function: "connectionValidation",
      url: this.url,
      shotdown: this.shotdown,
    });

    if (this.connectionTimer !== null) {
      clearTimeout(this.connectionTimer);
      this.connectionTimer = null;
    }

    if (!this.shotdown) {
      this.connectionTimer = setTimeout(() => {
        this.connectionValidationTimeout();
      }, LEDGER_CLOSED_TIMEOUT);
    } else {
      this.client.disconnect();
    }
  }

  private async connectionValidationTimeout(): Promise<void> {
    this.logger?.debug({
      service: "Bithomp::XRPL::Connection",
      function: "connectionValidationTimeout",
      url: this.url,
      timeout: LEDGER_CLOSED_TIMEOUT,
      shotdown: this.shotdown,
    });

    this.connectionTimer = null;

    this.updateLatence(LEDGER_CLOSED_TIMEOUT);
    await this.reconnect();
  }
}

export { Connection };
