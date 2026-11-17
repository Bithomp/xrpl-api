# Project guidance

## Purpose and network scope

`@bithomp/xrpl-api` is a JavaScript/TypeScript library for interacting with both
the XRP Ledger (XRPL) and Xahau. It provides connection management, ledger
queries, transaction parsing, wallet/signing utilities, and validator lists.

**The current major version supports only one active network at a time.**
Multiple server connections provide routing, failover, and optional load
balancing within that same network; they do not provide simultaneous access to
different networks. Do not mix XRPL and Xahau endpoints, or mainnet and testnet
endpoints, in a single client configuration.

- `src/client.ts` holds module-level connection and configuration state.
  `Client.setup()` configures the shared client; it does not create an independent
  client instance. Some parsers also read the shared native currency.
- Use `nativeCurrency: "XRP"` for XRPL and `nativeCurrency: "XAH"` for Xahau.
  Keep endpoints, network IDs, currency, and binary definitions consistent with
  the selected network. A currency name alone does not identify mainnet/testnet.
- A `networkID` option or filter does not imply concurrent multi-network support.
- Tests that change client configuration must run sequentially and clean up
  connections and restore shared settings as appropriate.
- Simultaneous multi-network support may be introduced in a future major
  version. Preserve the current behavior unless the task explicitly calls for
  that redesign. Avoid adding unnecessary global state that would make future
  isolation harder, but do not introduce a new client architecture speculatively.

## Repository map

- `src/index.ts`: public namespace exports (`Client`, `Models`, `Wallet`,
  `Faucet`, `Validator`, `Parse`, `Common`, `Types`, and the upstream `xrpl`).
- `src/client.ts`, `src/connection.ts`: shared client setup, connection selection,
  WebSocket requests, subscriptions, and connection lifecycle.
- `src/ledger/`: ledger RPC helpers, pagination, fees, transaction submission,
  and validator-list operations; exported through `Client`.
- `src/models/`: response models and helpers that interpret ledger data.
- `src/parse/`: transaction specifications, ledger fields, and transaction outcomes.
- `src/types/`: library types, including protocol features beyond upstream types.
- `src/wallet.ts`, `src/validator.ts`, `src/base58.ts`: signing, hashing,
  validator keys, and encoding utilities.
- `src/common/`: shared constants, errors, and numeric utilities.
- `src/v1/`: legacy compatibility helpers; preserve their public behavior.
- `config/xahau_definitions.json`: bundled Xahau binary codec definitions.
- `test/`: Mocha tests; `test/examples/` and `test/fixtures/` contain sample data.
- `lib/`: generated JavaScript and declarations, ignored by Git. Edit `src/`,
  then build; do not edit generated files.

## Development commands

Use npm and the committed `package-lock.json`. `package.json` requires Node.js
20 or newer; CI currently uses Node.js 22. Inspect the current package scripts
and configuration before changing tooling.

```sh
npm ci                  # Install locked dependencies; prepare also runs the build
npm run build           # Compile src/ to lib/ and emit declarations
npm run lint            # Run ESLint
npm test                # Full suite, including live network integration tests
```

Run an isolated test file without loading the default full-suite configuration:

```sh
./node_modules/.bin/mocha --no-config --require ts-node/register --timeout 5000 test/app_loader_definitions.test.ts
```

Replace the file path with the relevant isolated test. Inspect its imports and
hooks first: a test under `test/models/` or with fixtures may still connect to a
network. `--grep` alone does not prevent other test files and root hooks from
being loaded by the default configuration.

`npm run format` rewrites TypeScript and JavaScript throughout `src/`. Prefer
formatting only changed files when a repository-wide rewrite is outside scope.
Follow the existing two-space indentation, double quotes, semicolons, and
Prettier configuration (120-column print width, ES5 trailing commas).

## Implementation expectations

- Keep changes focused and preserve public exports, signatures, formatted output
  shapes, and legacy behavior unless the requested change requires otherwise.
  Update types, exports, examples, and documentation when changing a public API.
- Follow existing TypeScript module and naming conventions. The build targets
  ES2020/CommonJS and emits declarations; keep imports compatible with that build.
- Support both networks in shared code. Do not assume every XRPL feature exists
  on Xahau, every Xahau feature exists on XRPL, or that upstream `xrpl` types
  describe all Xahau transactions and ledger entries.
- Pass the selected network's binary definitions through encoding, decoding,
  signing, hashing, fees, and nested/emitted transaction parsing where supported.
  Reuse the existing definitions APIs, including `Wallet.getXahauDefinitions()`.
- Treat definition changes as protocol changes. Verify field names, type codes,
  and serialization against authoritative protocol sources and representative
  fixtures. Add round-trip and compatibility coverage when changing encoding.
- Preserve exact monetary values. Use existing string-based amount handling,
  `BigNumber`, and conversion helpers instead of floating-point arithmetic.
  Distinguish drops, native currency units, issued currencies, and MPT amounts;
  do not infer units solely from legacy helper names containing `Xrp`.
- Preserve fee limits and rounding behavior. Keep network ID handling, signing
  payloads, hashes, and validation consistent with the selected network.
- Reuse connection selection, timeout, retry, pagination, and error conventions.
  Clean up sockets, subscriptions, and timers introduced by a change.

## Tests and verification

- Add focused regression tests for behavior changes. Prefer deterministic
  fixtures and mocked connections for parsing, serialization, and fee logic.
- For shared network behavior, cover XRPL and Xahau where relevant, including
  explicit currency and definitions handling. Keep network-specific fixtures
  identifiable and test unknown or unsupported inputs where applicable.
- The default Mocha configuration loads `test/**/*.test.ts`.
  `test/index.test.ts` loads local `config/test.json` with `nconf` and establishes
  live connections. Other suites can reconfigure the shared client.
- The full suite includes transaction submissions and payment operations using
  configured accounts. Inspect the selected tests and configuration before
  running integration tests; use designated test networks and test credentials
  for operations that change ledger state. Do not submit mainnet transactions
  as routine verification.
- `config/test.json` is ignored by Git and CI supplies it separately. Do not
  commit it, expose its credentials, or invent replacement secrets. Keep seeds,
  private keys, and tokens out of logs and new fixtures; use clearly disposable
  test keys for offline cryptographic tests.
- For code changes, run the build, lint, and relevant isolated tests. Run the full
  suite when its network and account configuration is available and appropriate.
  Report which checks ran and any failures or checks blocked by missing setup.
  Documentation-only changes do not require live network tests.

## Scope and delivery

- Preserve unrelated local changes. Avoid broad refactors, dependency upgrades,
  lockfile churn, or formatting changes unrelated to the task.
- Do not bump versions, publish packages, or run release lifecycle commands
  unless requested. `npm version` invokes scripts that stage files and push
  commits and tags.
- Summarize the resulting behavior, relevant verification, and any remaining
  limitations. State clearly when a change affects one network specifically.
