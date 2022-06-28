# @Bithomp/xrpl-api

A Bithomp JavaScript/TypeScript library for interacting with the XRP Ledger

In an existing project (with `package.json`), install `@bithomp/xrpl-api`:

```
$ npm install --save @bithomp/xrpl-api
```

# Example of use

```
const BithompXRPL = require("@bithomp/xrpl-api");
const config = [
  {
    "url": "wss://s2.ripple.com",
    "type": "regular,history"
  },
  {
    "url": "wss://xrplcluster.com",
    "type": "regular,history,gateway_balances"
  }
];

// setup and connect
BithompXRPL.Client.setup(config);
await BithompXRPL.Client.connect();

// send request
const accountInfo = await BithompXRPL.Client.getAccountInfo("rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z");

// when complete
BithompXRPL.Client.disconnect();
```
