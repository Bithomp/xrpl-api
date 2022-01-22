import { Client, Request, Response } from "xrpl";

export interface ConnectionOptions {}
export interface LatencyInfo {
  timestamp: Date;
  delta: number;
}

class Connection {
  public readonly client: Client;
  public readonly url: string;
  public readonly type?: string;
  public latency: LatencyInfo[];

  public constructor(url: string, type?: string, options: ConnectionOptions = {}) {
    this.url = url;
    this.type = type;
    this.latency = [];
    this.client = new Client(url);
  }

  public async connect() {
    return await this.client.connect();
  }

  public async disconnect() {
    return await this.client.disconnect();
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
      return e.data;
    }
  }

  public isConnected(): boolean {
    return this.client.isConnected();
  }

  public getLatenceMs(): number {
    return this.latency.map((info) => info.delta).reduce((a, b) => a + b, 0) / this.latency.length || 0;
  }

  private updateLatence(delta: number) {
    this.latency.push({
      timestamp: new Date(),
      delta,
    });

    this.latency.splice(0, this.latency.length - 10);
  }
}

export { Connection };
