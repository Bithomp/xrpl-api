import nconf from "nconf";
import { Client } from "../src/index";

const config = `config/test.json`;
nconf.argv().env("_").file(config);

before(async function () {
  this.timeout(10000);
  Client.setup(nconf.get("xrpl:connections:testnet"), { nativeCurrency: "XRP" });
  await Client.connect();
});

after(async function () {
  Client.disconnect();
});
