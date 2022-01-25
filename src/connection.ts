import { Client, Request, Response } from "xrpl";

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
  public latency: LatencyInfo[];
  public readonly logger?: any;
  private shotdown: boolean = false;
  private connectionTimer: any = null;

  public constructor(url: string, type?: string, options: ConnectionOptions = {}) {
    this.url = url;
    this.type = type;
    this.latency = [];
    this.client = new Client(url);
    this.logger = options.logger;

    this.setupEmitter();
  }

  public async connect(): Promise<void> {
    await this.client.connect();
    await this.subscribeClosedLedger();

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

  private setupEmitter(): void {
    this.client.on("connected", () => {
      this.logger?.debug({
        service: "Bithomp::XRPL::Connection",
        function: "connected",
      });
    });

    this.client.on("disconnected", () => {
      this.logger?.debug({
        service: "Bithomp::XRPL::Connection",
        function: "disconnected",
      });

      if (!this.shotdown) {
        this.client.connect();
      }
    });

    this.client.on("ledgerClosed", () => {
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
    });

    this.connectionTimer = null;

    if (!this.shotdown) {
      await this.client.disconnect();
      await this.client.connect();
    }
  }
}

export { Connection };
