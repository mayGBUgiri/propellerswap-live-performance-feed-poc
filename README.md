# PropellerSwap Live Performance Feed

Credibility PoC for PropellerHeads' CoW Swap solver running on Fynd + Tycho.

The feed shows PropellerSwap auction outcomes, solve timing, chosen routes, candidate routes evaluated by Fynd, and external verification slots.

## Run

```powershell
Copy-Item .env.example .env.local
# edit .env.local and set TYCHO_API_KEY
.\scripts\start-feed.ps1
```

Open `http://127.0.0.1:4173/`.

## GitHub Pages Demo

This PoC also works as a static GitHub Pages site. On `github.io`, it automatically runs in replay-demo mode because GitHub Pages cannot run the local Node API server.

Static demo includes:

- Replayed PropellerSwap auction events.
- Route decision spotlight.
- Candidate route inspection.
- Filters and exports.
- Methodology and run-local documentation.

Local-only features:

- Tycho health/summary checks.
- Fynd health check.
- `POST /api/events` production ingestion.

## PoC Boundary

The current feed replays realistic PropellerSwap sample events so the product surface can be shared before production solver logs are wired in. Simulation is the only mocked layer.

Production-shaped pieces already included:

- Server-side Tycho proxy.
- Real `/api/events` ingestion endpoint.
- File-backed event persistence.
- Route inspection UI.
- JSON and CSV exports.
- Methodology and run-local surfaces.

## What Is Implemented

- Event-backed live auction feed with wins, losses, and timeouts once production events are posted.
- Solve time, token pair, trade size, route, block, auction ID, Fynd commit, and route trace per entry.
- CoW Explorer and settlement transaction link slots.
- Aggregate median solve time, win rate, routed volume, and average candidate routes evaluated.
- Expandable route inspection with candidate routes, selected route, algorithm labels, gas, and net score.
- Run-it-yourself surface for solving live CoW orders locally with Fynd.
- Raw JSON and CSV exports for a selected block range.
- Methodology page explaining computations, route transparency, proof boundaries, and limitations.
- Server-side Tycho proxy and real `/api/events` ingestion endpoint.

## Event Ingestion

The feed uses realistic PropellerSwap simulation data until real solver events are posted. Simulation is the only mocked layer; Tycho status, Fynd health, event ingestion, persistence, exports, route inspection, and methodology are built as production-shaped surfaces.

```powershell
Invoke-RestMethod http://127.0.0.1:4173/api/events -Method POST -ContentType "application/json" -Body '<production-event-json>'
```

Once `data/events.json` contains real events, the UI automatically switches from simulation mode to production event mode.

## Production Hookup

This workspace does not include the old PropellerSwap CoW solver logs. Wire its structured solve/notify logs to `POST /api/events` using the schema shown on the Methodology page.

See [docs/fynd-tycho-setup.md](docs/fynd-tycho-setup.md) for the Tycho proxy, Fynd startup path, and production live-feed pipeline.
