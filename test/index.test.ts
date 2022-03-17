import nconf from "nconf";
import { Client } from "../src/index";
import { exit } from "process";

const config = `config/test.json`;
nconf.argv().env("_").file(config);

before(async function () {
  Client.setup(nconf.get("xrpl:connections:testnet"));
  await Client.connect();
});

after(async function () {
  Client.disconnect();

  setTimeout(exit, 5000);
});
