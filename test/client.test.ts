import nconf from "nconf";
import { expect } from "chai";
import { Client } from "../src/index";
import { Connection } from "../src/connection";

describe("Client", () => {
  describe("mainnet", () => {
    before(async function () {
      this.timeout(15000);
      Client.setup(nconf.get("xrpl:connections:mainnet"), { loadBalancing: true, nativeCurrency: "XRP" });
      await Client.connect();
    });

    describe("findConnection", () => {
      it("returns connection", async function () {
        expect(Client.findConnection()).to.be.an.instanceOf(Connection);
      });

      it("returns connection with by type history", async function () {
        const connection = Client.findConnection("history") as Connection;
        expect(connection.types).to.include("history");
      });

      it("returns connection with by type gateway_balances", async function () {
        const connection = Client.findConnection("gateway_balances") as Connection;
        expect(connection.url).to.eq("wss://xrplcluster.com");
        expect(connection.types).to.include("gateway_balances");
      });

      it("returns connection with by url", async function () {
        const connection = Client.findConnection(undefined, "wss://s1.ripple.com") as Connection;
        expect(connection.url).to.eq("wss://s1.ripple.com");
      });

      it("returns connection with by url and strong filter ", async function () {
        const connection = Client.findConnection(undefined, "wss://test.com", true);
        expect(connection).to.eq(null);
      });
    });
  });
});
