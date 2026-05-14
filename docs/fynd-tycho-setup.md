# Fynd + Tycho Setup

## What The Tycho Key Unlocks

The Tycho key should be used only by server-side processes:

- This app's `server.js` proxy for Tycho RPC health, protocol systems, and token metadata.
- A Fynd process using `TYCHO_API_KEY` and `TYCHO_URL`.
- The local run-it-yourself path that solves live CoW orders on the user's machine.

Do not place the key in `app.js`, browser local storage, static JSON, or committed config.

## Local Feed Server

Create `.env.local` from `.env.example`, then set:

```powershell
TYCHO_API_KEY=<your-key>
TYCHO_RPC_URL=https://tycho-beta.propellerheads.xyz
FYND_URL=http://127.0.0.1:3000
```

Run:

```powershell
.\scripts\start-feed.ps1
```

Useful checks:

```powershell
Invoke-RestMethod http://127.0.0.1:4173/api/config
Invoke-RestMethod http://127.0.0.1:4173/api/tycho/health
Invoke-RestMethod http://127.0.0.1:4173/api/fynd/health
```

## Fynd

Fynd is documented as three crates:

- `fynd-core`: solving logic.
- `fynd-rpc`: HTTP RPC server builder.
- `fynd`: complete CLI HTTP server.

The documented local service starts on `http://localhost:3000`, with health at `/v1/health` and quotes at `/v1/quote`.

Expected setup:

```powershell
git clone https://github.com/propeller-heads/fynd.git vendor/fynd
$env:TYCHO_API_KEY="<your-key>"
$env:TYCHO_URL="tycho-fynd-ethereum.propellerheads.xyz"
$env:RPC_URL="<dedicated-chain-rpc-url>"
.\scripts\start-fynd.ps1
```

Production should supply a dedicated chain RPC endpoint. Fynd's docs note a public default, but that is not the right reliability posture for a public performance feed.

On this Windows workspace, the cloned Fynd binary needed one local portability fix: `vendor/fynd/src/main.rs` now guards Unix SIGTERM handling with `#[cfg(unix)]` and uses Ctrl+C handling on Windows. After that patch, `cargo check --bin fynd` and `cargo build --bin fynd` both pass.

## Live Feed Pipeline

1. CoW solver request arrives at production `POST /solve`.
2. Fynd computes the production route under the normal auction time budget.
3. Structured solve event is emitted with auction ID, block, order params, route, solve time, Fynd commit, config, and Tycho state version.
4. CoW `POST /notify` updates the event with win/loss and settlement transaction hash when present.
5. The route trace records every candidate Fynd evaluated, how algorithms scored them, and why the chosen route won.
6. The public feed stores immutable rows and streams updates to the frontend.
7. A solve-only local stream lets users run Fynd against live CoW orders without submitting settlements.

## Future Engineering Gap

Historical no-time-limit re-solves are now a future consideration, not the launch requirement. Once Tycho historical replay exists and algorithms become complex enough that auction time meaningfully constrains results, the "optimal mode" could be implemented as one of:

- A dedicated Fynd worker pool with a much larger timeout and deeper route bounds.
- A small internal service using `fynd-core` directly.
- A patched Fynd RPC endpoint that accepts the auction/order payload plus a block/state version and returns the best route and candidate set.

The launch UI and event schema focus on route transparency and local reproducibility first.
