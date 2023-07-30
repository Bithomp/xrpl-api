# @Bithomp/xrpl-api

A Bithomp JavaScript/TypeScript library for interacting with the XRP Ledger
Library designed to be a single point of access to the XRP Ledger. It uses multiple connections to the XRP Ledger and selects the best one for the request. If the connection is lost, the library will automatically reconnect.

The library also supports the creation of a validator list.

In an existing project (with `package.json`), install `@bithomp/xrpl-api`:

```Shell
# install package
$ npm install --save @bithomp/xrpl-api
```

# Examples of use

## Account info

```JS
const BithompXRPL = require("@bithomp/xrpl-api");

// setup connection
const config = [
  {
    "url": "wss://xrplcluster.com",
    "type": "regular,history,gateway_balances,last_close,manifest,payment,submit",
    "connectionTimeout": 10000
  },
  {
    "url": "wss://s1.ripple.com",
    "type": "regular,history,payment,submit",
    "connectionTimeout": 10000
  },,
  {
    "url": "wss://s2.ripple.com",
    "type": "regular,history,payment,submit",
    "connectionTimeout": 10000
  },
  {
    "url": "wss://s2-clio.ripple.com",
    "type": "clio,account_objects",
    "connectionTimeout": 10000
  }
];

// Global setup for all connections, if you have multiple connections, like in example, the library will use them by type and(or) by better response time
BithompXRPL.Client.setup(config);

// connect to all servers
await BithompXRPL.Client.connect();

// send request
const accountInfo = await BithompXRPL.Client.getAccountInfo("rsuUjfWxrACCAwGQDsNeZUhpzXf1n1NK5Z");

// when complete, disconnect
BithompXRPL.Client.disconnect();
```

## Create Validator List

_Setup connection_, it is required to get validators details from the ledger.

```JS
const BithompXRPL = require("@bithomp/xrpl-api");
// setup connection
const config = [
  {
    // this connection will be used to get validators details from the ledger, use web socket with connection to network you are building list for (mainnet, testnet, devnet, etc.)
    "url": "wss://xrplcluster.com",
    "connectionTimeout": 10000
  }
];
BithompXRPL.Client.setup(config);

// connect
await BithompXRPL.Client.connect();

// validator secrets, should not belong to any validators keys. can be any ed25519 (publicKey starts on `ED`) or secp256k1 could be used,
// can ne generated with BithompXRPL.Validator.generateSecrets() or by generateSeed from ripple-keypairs
const vk = {
  privateKey: "p__________________________",
  publicKey: "ED________________________________",
};

// signing secrets, should not belong to any validators keys. can be any ed25519 (publicKey starts on `ED`) or secp256k1 could be used
// can ne generated with BithompXRPL.Validator.generateSecrets() or by generateSeed from ripple-keypairs
const sk = {
  privateKey: "p__________________________",
  publicKey: "ED_______________________________",
};

// validator list, public addresses, they have to be available on the ledger for accessing to manifest data (it will be stored in a blob), the address should start on letter `n`
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
