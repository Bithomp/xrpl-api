# @Bithomp/xrpl-api

A Bithomp JavaScript/TypeScript library for interacting with the XRP Ledger

In an existing project (with `package.json`), install `@bithomp/xrpl-api`:

```
$ npm install --save @bithomp/xrpl-api
```

# Example of use

## Account info

```
const BithompXRPL = require("@bithomp/xrpl-api");

// setup connection
const config = [
  {
    "url": "wss://xrplcluster.com",
    "type": "regular,history,gateway_balances,last_close,manifest",
    "connectionTimeout": 10000
  },
  {
    "url": "wss://s2.ripple.com",
    "type": "regular,history",
    "connectionTimeout": 10000
  },
  {
    "url": "wss://s1.ripple.com",
    "type": "regular,clio",
    "connectionTimeout": 10000
  }
];
BithompXRPL.Client.setup(config);

// connect
await BithompXRPL.Client.connect();

// send request
const accountInfo = await BithompXRPL.Client.getAccountInfo("rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z");

// when complete, disconnect
BithompXRPL.Client.disconnect();
```

## Create Validator List

_Setup connection_

```
// setup connection
const config = [
  {
    "url": "wss://xrplcluster.com",
    "connectionTimeout": 10000
  }
];
BithompXRPL.Client.setup(config);

// connect
await BithompXRPL.Client.connect();

// validator secrets
const vk = {
  privateKey: "p__________________________",
  publicKey: "ED________________________________",
};

// signing secrets
const sk = {
  privateKey: "p__________________________",
  publicKey: "03_______________________________",
};

// validator list, public addresses, they have to be avalable on the ledger for accessing to manifest
const validators = ["nHBidG3pZK11zQD6kpNDoAhDxH6WLGui6ZxSbUx7LSqLHsgzMPec"];
const sequence = 1; // sequence number
const expiration = 1696508603; // in unixtime (seconds)
const vl = await BithompXRPL.Client.createVL(vk, sk, sequence, expiration, validators);

// vl will contain the signed validator list with
// {
//   "blob": "...",
//   "manifest": "...", // signed with vk.privateKey and sk.privateKey
//   "signature": "...", // signed with sk.privateKey
//   "version": 1,
//   "public_key": "..." // vk.publicKey
// }

//  disconnect
BithompXRPL.Client.disconnect();
```
