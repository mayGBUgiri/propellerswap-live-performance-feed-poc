# Live Performance Feed Research Notes

## Product Thesis

The proposal is aimed at solver teams, not retail traders. The product should behave like infrastructure telemetry: dense, auditable, low-editorial, and comfortable exposing losses. The launch credibility signal is route transparency: every row links to independent outcome verification and expands to show the candidate routes Fynd evaluated, how algorithms scored them, and why the chosen route won.

## Current External Interfaces

- CoW Protocol solver integrations expose `POST /solve` for auction instances and `POST /notify` for auction results. This is the clean source for internal production solve timing, route, Fynd version, and win/loss notifications. Source: https://cowswap.mintlify.app/cow-protocol/reference/apis/solver
- CoW exposes solver competition lookups by auction and settlement transaction in its SDK surface. This is useful for enriching settled wins with auction IDs, competing solutions, and ranking context after settlement. Source: https://docs.rs/cow-rs/latest/cow_rs/prelude/struct.TradingSdk.html
- CoW competition rules score solutions from executed amounts and surplus, and winning settlement transactions are independently verifiable on-chain.
- Tycho indexes on-chain liquidity state with low latency, supports reorg-aware streams, and stores state changes at transaction/block granularity. That makes it the right source for real-time local solving and future historical replay. Sources: https://docs.propellerheads.xyz/tycho/overview/concepts and https://docs.propellerheads.xyz/tycho/for-dexs/protocol-integration/indexing
- Fynd is documented as a real-time multi-protocol router over Tycho-supported liquidity. The product should expose how Fynd found the route, not only the final route.

## Implementation Boundary In This Workspace

This workspace was empty, and no private Fynd solver logs, Tycho state replay service, or production API credentials were present. The shipped app therefore implements:

- The public product surface.
- The event schema production logging must emit.
- Real local ingestion and persistence through `POST /api/events` and `data/events.json`.
- Realistic PropellerSwap simulation events as the only mocked layer until production events are connected.
- Expandable candidate route inspection.
- Aggregate stats.
- Raw JSON/CSV export over a selected block range.
- Methodology copy that states what is independent, what route transparency proves, and what is not proven.
- Run-it-yourself copy and setup path for local solve-only reproduction.

To go fully live, post PropellerSwap production `solve` and `notify` events plus route trace data emitted by Fynd to `POST /api/events`.

## Production Pipeline Shape

1. Solver receives CoW auction through `POST /solve`.
2. Fynd production route is computed and logged with auction ID, block, order params, route, solve time, commit hash, and config.
3. CoW calls `POST /notify`; update the row with win/loss, reason, and transaction hash if settled.
4. If there is a settlement transaction, enrich with CoW competition data by transaction hash and attach the CoW Explorer/Etherscan URLs.
5. Emit route trace data: candidate routes evaluated, algorithm score, gas estimate, net output, selected route, and chosen reason.
6. Emit `complete`, `partial`, or `pending` depending on how much route trace was captured.
7. Append immutable row data to a public store and stream row updates to the app.

## Credibility Risks

- One wrong row damages the whole artifact. Treat all public rows as immutable audit records and correct with explicit revisions rather than silent mutation.
- Do not present future historical optimality checks as available today. Markus noted historical replay is theoretically possible but not implemented yet, and current algorithms already sweep very completely within the auction window.
- The stronger launch claim is practical reproducibility: run Fynd locally against live CoW orders and inspect/modify the route-finding process.
- Do not hide losses or timeouts. Filtering is fine; default inclusion is required.
- Empty launch state undercuts the premise. Seed with real historical rows before publishing the URL.
