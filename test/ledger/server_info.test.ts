import nconf from "nconf";
import * as chai from "chai";
import { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import { Client } from "../../src/index";

chai.use(chaiAsPromised);

describe("Client", () => {
  describe("getServerInfo", () => {
    describe("mainnet", () => {
      before(async function () {
        this.timeout(15000);
        Client.setup(nconf.get("xrpl:connections:mainnet"));
        await Client.connect();
      });

      it("works with history", async function () {
        const result: any = await Client.getServerInfo({ type: "history,last_close,!clio" });

        expect(result.info.server_state).to.eql("full");
        delete result.info.jq_trans_overflow;
        delete result.info.peer_disconnects;
        delete result.info.peer_disconnects_resources;
        delete result.info.peers;
        delete result.info.published_ledger;
        delete result.info.reporting;
        delete result.info.fetch_pack;
        delete result.info.load_factor_server;
        delete result.info.network_id;
        expect(Object.keys(result.info)).to.eql([
          "build_version",
          "complete_ledgers",
          "hostid",
          "initial_sync_duration_us",
          "io_latency_ms",
          "last_close",
          "load_factor",
          "pubkey_node",
          "server_state",
          "server_state_duration_us",
          "state_accounting",
          "time",
          "uptime",
          "validated_ledger",
          "validation_quorum",
        ]);
      });

      it("works with url", async function () {
        const result: any = await Client.getServerInfo({ url: "wss://xrplcluster.com" });

        expect(result.info.server_state).to.eql("full");
        delete result.info.jq_trans_overflow;
        delete result.info.peer_disconnects;
        delete result.info.peer_disconnects_resources;
        delete result.info.peers;
        delete result.info.published_ledger;
        delete result.info.reporting;
        delete result.info.fetch_pack;
        delete result.info.load_factor_server;
        delete result.info.network_id;
        expect(Object.keys(result.info)).to.eql([
          "build_version",
          "complete_ledgers",
          "hostid",
          "initial_sync_duration_us",
          "io_latency_ms",
          "last_close",
          "load_factor",
          "pubkey_node",
          "server_state",
          "server_state_duration_us",
          "state_accounting",
          "time",
          "uptime",
          "validated_ledger",
          "validation_quorum",
        ]);
      });
    });

    describe("testnet", () => {
      before(async function () {
        Client.setup(nconf.get("xrpl:connections:testnet"));
        await Client.connect();
      });

      it("works with history", async function () {
        const result: any = await Client.getServerInfo();

        expect(result.info.server_state).to.eql("full");
        delete result.info.jq_trans_overflow;
        delete result.info.peer_disconnects;
        delete result.info.peer_disconnects_resources;
        delete result.info.peers;
        delete result.info.published_ledger;
        delete result.info.reporting;
        delete result.info.fetch_pack;
        delete result.info.initial_sync_duration_us;
        delete result.info.load_factor_server;
        delete result.info.network_id;
        expect(Object.keys(result.info)).to.eql([
          "build_version",
          "complete_ledgers",
          "hostid",
          "io_latency_ms",
          "last_close",
          "load_factor",
          "pubkey_node",
          "server_state",
          "server_state_duration_us",
          "state_accounting",
          "time",
          "uptime",
          "validated_ledger",
          "validation_quorum",
        ]);
      });

      it("handles with url", async function () {
        await expect(Client.getServerInfo({ url: "wss://s1.ripple.com" })).to.be.rejectedWith(
          Error,
          "There is no connection"
        );
      });
    });
  });
});
