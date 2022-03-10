import { Client, Request, Response } from "xrpl";
import { ledgerTimeToTimestamp } from "./client/ledger";

const LEDGER_CLOSED_TIMEOUT = 1000 * 10; // 10 sec

export interface ConnectionOptions {
  logger?: any;
}

export interface LatencyInfo {
  timestamp: Date;
  delta: number;
}

class Connection {
  public readonly client: Client;
  public readonly url: string;
  public readonly type?: string;
  public readonly types: string[];
  public latency: LatencyInfo[];
  public readonly logger?: any;
  private shotdown: boolean = false;
  private connectionTimer: any = null;

  public constructor(url: string, type?: string, options: ConnectionOptions = {}) {
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

    this.setupEmitter();
  }

  public async connect(): Promise<void> {
    try {
      await this.client.connect();
      await this.subscribeClosedLedger();
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

    await this.unsubscribeClosedLedger();
    await this.client.disconnect();
  }

  public async request(request: Request): Promise<Response | any> {
    try {
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

      return e.data;
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
    });

    this.client.on("disconnected", () => {
      this.logger?.debug({
        service: "Bithomp::XRPL::Connection",
        function: "disconnected",
        url: this.url,
      });

      this.reconnect();
    });

    this.client.on("ledgerClosed", (ledgerStream) => {
      const time: number = new Date().getTime();
      const ledgerTime: number = ledgerTimeToTimestamp(ledgerStream.ledger_time);

      // ledgerTime could be more then current time
      if (ledgerTime < time) {
        this.updateLatence(time - ledgerTime);
      }

      this.connectionValidation();
    });

    this.client.on("error", (e) => {
      this.logger?.error({
        service: "Bithomp::XRPL::Connection",
        function: "error",
        error: e.message || e.name || e,
      });
    });
  }

  private async subscribeClosedLedger(): Promise<Response | any> {
    return await this.request({
      command: "subscribe",
      streams: ["ledger"],
    });
  }

  private async unsubscribeClosedLedger(): Promise<Response | any> {
    return await this.request({
      command: "unsubscribe",
      streams: ["ledger"],
    });
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
