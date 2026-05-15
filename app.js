const explorers = {
  cow: "https://explorer.cow.fi/orders/",
  tx: "https://etherscan.io/tx/",
};

const staticDemoMode = location.hostname.endsWith("github.io");

const simulatedEvents = [
  event({
    auctionId: "0x8f3a9f6c9d1e2c0a6b18a71b902f3d5c6f0b88fd0a49be1047e0d41f63a19d2c",
    blockNumber: 19872345,
    solverCommit: "fynd-a1b2c3d",
    pair: "USDC / WETH",
    tradeSizeUsd: 401002,
    tradeSizeDisplay: "393,139.22 USDC",
    solveTimeMs: 312,
    outcome: "won",
    route: ["CoW AMM", "Uniswap V3"],
    settlementTx: "0xd51f97be49e5b2f7b71e6dc274b8baf06d9e114df293b824d195d9ab94840135",
    chosenReason: "highest net output after gas across returned workers",
    candidates: [
      candidate(1, ["CoW AMM", "Uniswap V3"], 1, "158.293014 WETH", "selected", "0.002760", "fynd-production-fast", true),
      candidate(2, ["Uniswap V3"], 0, "158.161882 WETH", "-0.0829%", "0.002140", "direct-v3"),
      candidate(3, ["Balancer V2", "Uniswap V3"], 1, "158.071505 WETH", "-0.1399%", "0.003420", "split-route"),
      candidate(4, ["Curve", "Uniswap V3"], 1, "157.944210 WETH", "-0.2203%", "0.003960", "stable-hop"),
      candidate(5, ["CoW AMM"], 0, "157.812604 WETH", "-0.3034%", "0.001980", "cowamm-direct"),
      candidate(6, ["SushiSwap", "Uniswap V3"], 1, "157.533910 WETH", "-0.4795%", "0.003220", "fallback"),
    ],
  }),
  event({
    auctionId: "0x7c12e81aa3b75c21a2968dc7d3e2359e816cf79e8f60da8a37d0b460c98e9e11",
    blockNumber: 19872344,
    solverCommit: "fynd-a1b2c3d",
    pair: "DAI / WETH",
    tradeSizeUsd: 801240,
    tradeSizeDisplay: "785,529.41 DAI",
    solveTimeMs: 428,
    outcome: "won",
    route: ["CoW AMM", "Uniswap V3", "Balancer V2"],
    settlementTx: "0x4cf4fa62aa31c6f4f9432ed475d0db79358e5f5fa31536498e52c6ce6d4248f0",
    chosenReason: "multi-hop candidate improved net output after gas",
    candidates: [
      candidate(1, ["CoW AMM", "Uniswap V3", "Balancer V2"], 2, "316.770129 WETH", "selected", "0.004180", "fynd-production-fast", true),
      candidate(2, ["Uniswap V3"], 0, "316.208881 WETH", "-0.1772%", "0.002090", "direct-v3"),
      candidate(3, ["Curve", "Uniswap V3"], 1, "316.114309 WETH", "-0.2071%", "0.003640", "stable-hop"),
      candidate(4, ["Balancer V2"], 0, "315.990772 WETH", "-0.2461%", "0.002880", "most-liquid"),
      candidate(5, ["SushiSwap", "Uniswap V3"], 1, "315.602870 WETH", "-0.3686%", "0.003150", "fallback"),
      candidate(6, ["CoW AMM"], 0, "315.517240 WETH", "-0.3957%", "0.001920", "cowamm-direct"),
    ],
  }),
  event({
    auctionId: "0x3f91c21cc812720fb93d8e1f26b4fca3f3edc9e5f50df46f46315f2a25ed4928",
    blockNumber: 19872343,
    solverCommit: "fynd-a1b2c3d",
    pair: "WBTC / USDC",
    tradeSizeUsd: 670150,
    tradeSizeDisplay: "10.21 WBTC",
    solveTimeMs: 510,
    outcome: "lost",
    route: ["Uniswap V3"],
    settlementTx: null,
    traceStatus: "partial",
    chosenReason: "fast path returned before all candidate workers completed",
    candidates: [
      candidate(1, ["Uniswap V3"], 0, "668,418.23 USDC", "selected", "0.002800", "fynd-production-fast", true),
      candidate(2, ["Balancer V2", "Curve"], 1, "668,103.92 USDC", "-0.0470%", "0.003620", "split-route"),
      candidate(3, ["CoW AMM", "Uniswap V3"], 1, "667,990.14 USDC", "-0.0641%", "0.003210", "weighted-graph"),
      candidate(4, ["SushiSwap", "Uniswap V3"], 1, "667,410.90 USDC", "-0.1507%", "0.003980", "fallback"),
    ],
  }),
  event({
    auctionId: "0x6de93b44b0ad18b2f734dc291a6a54239ff3877a0b4c0cc9e3d239b9e65710aa",
    blockNumber: 19872343,
    solverCommit: "fynd-a1b2c3d",
    pair: "WETH / wstETH",
    tradeSizeUsd: 1450000,
    tradeSizeDisplay: "580.00 WETH",
    solveTimeMs: 356,
    outcome: "won",
    route: ["CoW AMM", "Curve"],
    settlementTx: "0xa1c4fbe7c41a42c203ce6d18e8c4363d9dc7ef9b280d9bdbb749f1598b432ce5",
    chosenReason: "stable pool path dominated after gas and price impact",
    candidates: [
      candidate(1, ["CoW AMM", "Curve"], 1, "579.714021 wstETH", "selected", "0.002600", "fynd-production-fast", true),
      candidate(2, ["Curve"], 0, "579.229883 wstETH", "-0.0835%", "0.002410", "stable-direct"),
      candidate(3, ["Balancer V2", "Curve"], 1, "579.188101 wstETH", "-0.0907%", "0.003250", "split-route"),
      candidate(4, ["Uniswap V3"], 0, "578.902184 wstETH", "-0.1401%", "0.002310", "direct-v3"),
      candidate(5, ["CoW AMM"], 0, "578.661550 wstETH", "-0.1816%", "0.001970", "cowamm-direct"),
      candidate(6, ["Uniswap V3", "Curve"], 1, "578.428900 wstETH", "-0.2218%", "0.003870", "weighted-graph"),
    ],
  }),
  event({
    auctionId: "0x2b44589dd6ef808cae4468d5ae77866c4a450b04f201890fcba33293443dc6ef",
    blockNumber: 19872342,
    solverCommit: "fynd-a1b2c3d",
    pair: "USDC / DAI",
    tradeSizeUsd: 999100,
    tradeSizeDisplay: "979,509.80 USDC",
    solveTimeMs: 298,
    outcome: "won",
    route: ["CoW AMM"],
    settlementTx: "0x7df4dc3938a6df1fb0fddfffb18209dc1e59c0293c86a5213f6e9e907d475ef0",
    chosenReason: "single-hop CoW AMM candidate had best net stablecoin output",
    candidates: [
      candidate(1, ["CoW AMM"], 0, "999,011.02 DAI", "selected", "0.001880", "cowamm-direct", true),
      candidate(2, ["Curve"], 0, "998,720.81 DAI", "-0.0291%", "0.002110", "stable-direct"),
      candidate(3, ["Uniswap V3"], 0, "998,102.64 DAI", "-0.0909%", "0.002180", "direct-v3"),
      candidate(4, ["Balancer V2", "Curve"], 1, "997,889.43 DAI", "-0.1123%", "0.003560", "split-route"),
      candidate(5, ["SushiSwap"], 0, "996,871.12 DAI", "-0.2143%", "0.002400", "fallback"),
    ],
  }),
  event({
    auctionId: "0x1c7784aaab21e3ad617ce8fd4300d4d88c0c742c2df4a47cd34f8134a65d9811",
    blockNumber: 19872341,
    solverCommit: "fynd-a1b2c3d",
    pair: "ARB / WETH",
    tradeSizeUsd: 27391,
    tradeSizeDisplay: "72,081.44 ARB",
    solveTimeMs: 615,
    outcome: "won",
    route: ["SushiSwap", "Uniswap V3"],
    settlementTx: "0x82f21c3182418a448b12a2514f704e1e32b854bf1c3f7144861e17fdb68e0e09",
    traceStatus: "partial",
    chosenReason: "late worker responses did not beat selected route before deadline",
    candidates: [
      candidate(1, ["SushiSwap", "Uniswap V3"], 1, "10.822104 WETH", "selected", "0.003220", "fynd-production-fast", true),
      candidate(2, ["Uniswap V3"], 0, "10.795440 WETH", "-0.2464%", "0.002300", "direct-v3"),
      candidate(3, ["Balancer V2", "Uniswap V3"], 1, "10.764802 WETH", "-0.5296%", "0.003640", "split-route"),
      candidate(4, ["SushiSwap"], 0, "10.701293 WETH", "-1.1167%", "0.002210", "fallback"),
    ],
  }),
  event({
    auctionId: "0x3ad5f109ac47aa83f87b2a70afbb703706290f8f05daa218f922e948ccdde0db",
    blockNumber: 19872339,
    solverCommit: "fynd-a1b2c3d",
    pair: "LINK / WETH",
    tradeSizeUsd: 88432,
    tradeSizeDisplay: "5,141.40 LINK",
    solveTimeMs: 221,
    outcome: "lost",
    route: ["Balancer V2", "Uniswap V3"],
    settlementTx: null,
    chosenReason: "weighted graph search selected best net route among available candidates",
    candidates: [
      candidate(1, ["Balancer V2", "Uniswap V3"], 1, "34.921802 WETH", "selected", "0.003320", "weighted-graph", true),
      candidate(2, ["Uniswap V3"], 0, "34.887291 WETH", "-0.0988%", "0.002160", "direct-v3"),
      candidate(3, ["CoW AMM", "Uniswap V3"], 1, "34.800441 WETH", "-0.3476%", "0.003010", "cowamm-hop"),
      candidate(4, ["SushiSwap", "Uniswap V3"], 1, "34.751000 WETH", "-0.4892%", "0.003450", "fallback"),
      candidate(5, ["Balancer V2"], 0, "34.600187 WETH", "-0.9212%", "0.002810", "most-liquid"),
    ],
  }),
  event({
    auctionId: "0x9be4f2aa1d3c7e0b88f1a6c20e4d9f70b3a2c51e87d0f6b3c912e4a5d8b7f022",
    blockNumber: 19872337,
    solverCommit: "fynd-a1b2c3d",
    pair: "MKR / WETH",
    tradeSizeUsd: 142000,
    tradeSizeDisplay: "56.00 MKR",
    solveTimeMs: null,
    outcome: "timeout",
    route: [],
    settlementTx: null,
    traceStatus: "pending",
    chosenReason: "auction expired before solver returned a valid route",
    candidates: [],
  }),
];

function event({ traceStatus = "complete", candidates, chosenReason, ...item }) {
  return {
    ...item,
    source: "simulation",
    routeTrace: {
      status: traceStatus,
      chosenReason,
      capturedAt: "2026-05-14T12:00:00.000Z",
      candidates,
    },
  };
}

function candidate(rank, route, hops, estimatedOutput, netScore, gasEth, algorithm, chosen = false) {
  return { rank, route, hops, estimatedOutput, netScore, gasEth, algorithm, chosen };
}

let feed = [];
let simulationMode = true;
let simulationCursor = 0;
let simulationTick = 0;
let activeView = "live";
let paused = false;
let expandedId = null;

const els = {
  feedBody: document.querySelector("#feedBody"),
  medianSolve: document.querySelector("#medianSolve"),
  winRate: document.querySelector("#winRate"),
  volumeRouted: document.querySelector("#volumeRouted"),
  candidateAverage: document.querySelector("#candidateAverage"),
  feedCount: document.querySelector("#feedCount"),
  completeCount: document.querySelector("#completeCount"),
  partialCount: document.querySelector("#partialCount"),
  pendingCount: document.querySelector("#pendingCount"),
  tychoSummaryText: document.querySelector("#tychoSummaryText"),
  tychoStatusDot: document.querySelector("#tychoStatusDot"),
  tychoStatusText: document.querySelector("#tychoStatusText"),
  fyndStatusDot: document.querySelector("#fyndStatusDot"),
  fyndStatusText: document.querySelector("#fyndStatusText"),
  outcomeFilter: document.querySelector("#outcomeFilter"),
  traceFilter: document.querySelector("#traceFilter"),
  pauseButton: document.querySelector("#pauseButton"),
  streamStateText: document.querySelector("#streamStateText"),
  rawPreview: document.querySelector("#rawPreview"),
  fromBlock: document.querySelector("#fromBlock"),
  toBlock: document.querySelector("#toBlock"),
  spotlightPair: document.querySelector("#spotlightPair"),
  spotlightSummary: document.querySelector("#spotlightSummary"),
  spotlightSolve: document.querySelector("#spotlightSolve"),
  spotlightCandidates: document.querySelector("#spotlightCandidates"),
};

function filteredFeed() {
  const outcome = els.outcomeFilter.value;
  const trace = els.traceFilter.value;
  return feed.filter((item) => {
    const outcomeMatch = outcome === "all" || item.outcome === outcome;
    const traceMatch = trace === "all" || item.routeTrace.status === trace;
    return outcomeMatch && traceMatch;
  });
}

function render() {
  renderMetrics();
  renderSpotlight();
  renderFeed();
  renderRawPreview();
}

async function loadEvents() {
  const events = await Promise.resolve(staticDemoMode ? [] : fetchJson("/api/events")).catch(() => []);
  const realEvents = Array.isArray(events) ? events.map(normalizeEvent).sort((a, b) => b.blockNumber - a.blockNumber) : [];
  simulationMode = realEvents.length === 0;
  feed = simulationMode ? simulatedReplay() : realEvents;
  if ((!expandedId || !feed.some((item) => item.auctionId === expandedId)) && feed[0]) {
    expandedId = feed[0].auctionId;
  }
  renderSourceMode();
  render();
}

function simulatedReplay() {
  const replay = [];
  const baseBlock = Math.max(...simulatedEvents.map((item) => item.blockNumber));
  const windowSize = Math.min(7, simulatedEvents.length);

  for (let index = 0; index < windowSize; index += 1) {
    const source = simulatedEvents[(simulationCursor + index) % simulatedEvents.length];
    const drift = ((simulationTick + index) % 5) - 2;
    replay.push({
      ...source,
      auctionId: `${source.auctionId.slice(0, -8)}${String(simulationTick).padStart(4, "0")}${source.auctionId.slice(-4)}`,
      blockNumber: baseBlock + simulationTick - index,
      solveTimeMs: typeof source.solveTimeMs === "number" ? Math.max(180, source.solveTimeMs + drift * 17) : source.solveTimeMs,
      replayedAt: new Date().toISOString(),
      routeTrace: {
        ...source.routeTrace,
        candidates: source.routeTrace.candidates.map((candidate) => ({ ...candidate })),
      },
    });
  }

  simulationCursor = (simulationCursor + 1) % simulatedEvents.length;
  simulationTick += 1;
  return replay;
}

function renderSourceMode() {
  const title = document.querySelector("#sourceModeTitle");
  const text = document.querySelector("#sourceModeText");
  const dot = document.querySelector("#eventSourceDot");
  const label = document.querySelector("#eventSourceText");

  const badge = document.querySelector("#sourceBadge");

  if (simulationMode) {
    title.textContent = staticDemoMode ? "GitHub Pages demo" : "Simulation mode";
    text.textContent = "Only auction events are sample data. Tycho proxy, event ingestion, filtering, and export are production-shaped.";
    if (badge) badge.classList.remove("is-production");
    dot.classList.add("pending");
    label.textContent = staticDemoMode
      ? "Static demo replay active; server endpoints are disabled on GitHub Pages"
      : "Simulation data active; production solver event endpoint is ready";
  } else {
    title.textContent = "Production event mode";
    text.textContent = "Rendering real PropellerSwap solver events received by POST /api/events.";
    if (badge) badge.classList.add("is-production");
    dot.classList.remove("pending", "failed");
    label.textContent = "Production solver events are being ingested";
  }
}

function normalizeEvent(item) {
  return {
    auctionId: String(item.auctionId || ""),
    blockNumber: Number(item.blockNumber || 0),
    solverCommit: item.solverCommit || "unknown",
    pair: item.pair || "-",
    tradeSizeUsd: Number(item.tradeSizeUsd || 0),
    tradeSizeDisplay: item.tradeSizeDisplay || "",
    solveTimeMs: item.solveTimeMs == null ? null : Number(item.solveTimeMs),
    outcome: item.outcome || "timeout",
    route: Array.isArray(item.route) ? item.route : [],
    settlementTx: item.settlementTx || null,
    routeTrace: {
      status: item.routeTrace?.status || "pending",
      chosenReason: item.routeTrace?.chosenReason || "",
      candidates: Array.isArray(item.routeTrace?.candidates) ? item.routeTrace.candidates : [],
    },
  };
}

async function refreshServiceStatus() {
  if (staticDemoMode) {
    els.tychoStatusDot.classList.add("pending");
    els.tychoStatusText.textContent = "Tycho RPC: local server required";
    els.fyndStatusDot.classList.add("pending");
    els.fyndStatusText.textContent = "Fynd service: local server required";
    els.tychoSummaryText.textContent = "Static GitHub Pages demo uses replayed sample events. Run locally for live Tycho/Fynd checks.";
    return;
  }

  const [tycho, fynd] = await Promise.allSettled([
    fetchJson("/api/tycho/health"),
    fetchJson("/api/fynd/health"),
  ]);

  applyServiceStatus(
    els.tychoStatusDot,
    els.tychoStatusText,
    tycho.status === "fulfilled" && !tycho.value.error && tycho.value.status !== "missing_api_key",
    tycho.status === "fulfilled" ? tycho.value : { message: tycho.reason?.message || "unreachable" },
    "Tycho RPC",
  );

  applyServiceStatus(
    els.fyndStatusDot,
    els.fyndStatusText,
    fynd.status === "fulfilled" && !fynd.value.error && fynd.value.status !== "unreachable",
    fynd.status === "fulfilled" ? fynd.value : { message: fynd.reason?.message || "unreachable" },
    "Fynd service",
  );

  const summary = await Promise.resolve(fetchJson("/api/tycho/summary")).catch((error) => ({ error: true, message: error.message }));
  if (els.tychoSummaryText) {
    if (summary.error || summary.status === "missing_api_key") {
      els.tychoSummaryText.textContent = "Tycho summary unavailable until the API key is loaded by the server.";
    } else {
      els.tychoSummaryText.textContent = `${summary.protocolSystems?.length || 0} protocol systems indexed; ${summary.tokenTotal ?? "unknown"} active token records.`;
    }
  }
}

async function fetchJson(url) {
  if (staticDemoMode && url.startsWith("/api/")) {
    throw new Error("Server API is unavailable in GitHub Pages demo mode.");
  }

  const response = await fetch(url);
  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};
  if (!response.ok) return { ...payload, error: true };
  return payload;
}

function applyServiceStatus(dot, text, ok, payload, label) {
  dot.classList.toggle("pending", !ok);
  dot.classList.toggle("failed", false);
  text.textContent = ok ? `${label} connected` : `${label}: ${payload.message || payload.status || "not ready"}`;
}

function renderMetrics() {
  const solved = feed.filter((item) => typeof item.solveTimeMs === "number");
  const solveTimes = solved.map((item) => item.solveTimeMs).sort((a, b) => a - b);
  const median = solveTimes.length ? solveTimes[Math.floor(solveTimes.length / 2)] : 0;
  const submitted = feed.filter((item) => item.outcome !== "timeout").length;
  const wins = feed.filter((item) => item.outcome === "won").length;
  const complete = feed.filter((item) => item.routeTrace.status === "complete").length;
  const partial = feed.filter((item) => item.routeTrace.status === "partial").length;
  const pending = feed.filter((item) => item.routeTrace.status === "pending").length;
  const totalCandidates = feed.reduce((sum, item) => sum + item.routeTrace.candidates.length, 0);
  const volume = feed.reduce((sum, item) => sum + item.tradeSizeUsd, 0);

  els.medianSolve.textContent = `${median} ms`;
  els.winRate.textContent = submitted ? `${((wins / submitted) * 100).toFixed(1)}%` : "0%";
  els.volumeRouted.textContent = `$${compact(volume)}`;
  els.candidateAverage.textContent = feed.length ? (totalCandidates / feed.length).toFixed(1) : "0";
  [els.medianSolve, els.winRate, els.volumeRouted, els.candidateAverage].forEach(pop);
  els.completeCount.textContent = complete;
  els.partialCount.textContent = partial;
  els.pendingCount.textContent = pending;
}

function pop(element) {
  element.classList.remove("metric-pop");
  void element.offsetWidth;
  element.classList.add("metric-pop");
}

function renderSpotlight() {
  const item = feed.find((event) => event.outcome === "won" && event.routeTrace.candidates.length) || feed.find((event) => event.routeTrace.candidates.length);
  if (!item) {
    els.spotlightPair.textContent = "-";
    els.spotlightSummary.textContent = "Waiting for the latest route trace.";
    els.spotlightSolve.textContent = "- ms";
    els.spotlightCandidates.innerHTML = "";
    return;
  }

  const chosen = item.routeTrace.candidates.find((candidate) => candidate.chosen) || item.routeTrace.candidates[0];
  els.spotlightPair.textContent = item.pair;
  els.spotlightSolve.textContent = `${item.solveTimeMs ?? "-"} ms`;
  els.spotlightSummary.textContent = `${item.outcome.toUpperCase()} at block ${item.blockNumber}: ${chosen.route.join(" → ")} selected because ${item.routeTrace.chosenReason}.`;
  els.spotlightCandidates.innerHTML = item.routeTrace.candidates.slice(0, 4).map((candidate) => `
    <div class="route-step ${candidate.chosen ? "is-chosen" : ""}">
      <span class="route-rank">#${candidate.rank}</span>
      <span class="route-name">${candidate.route.join(" → ")} <span style="opacity:0.55;font-size:11px">${candidate.algorithm || ""}</span></span>
      <span class="route-score">${candidate.netScore}</span>
      <span class="route-gas">${candidate.gasEth} ETH</span>
    </div>
  `).join("");
}

function renderFeed() {
  const visible = filteredFeed();
  els.feedCount.textContent = `${visible.length} entries`;
  els.feedBody.innerHTML = "";

  if (!visible.length) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="10"><div class="empty-state"><strong>No events match the current filters.</strong><span>Clear filters or post production CoW/Fynd events to <span class="mono">POST /api/events</span>.</span></div></td>`;
    els.feedBody.append(row);
    return;
  }

  visible.forEach((item) => {
    const row = document.createElement("tr");
    row.className = `feed-row ${item.outcome}`;
    row.innerHTML = `
      <td><button class="expand-button" type="button" aria-label="Inspect route for auction ${short(item.auctionId)}" aria-expanded="${expandedId === item.auctionId}" data-expand="${item.auctionId}">${expandedId === item.auctionId ? "−" : "+"}</button><span class="status ${item.outcome}">${item.outcome}</span></td>
      <td>${item.solveTimeMs ? `<span class="${item.solveTimeMs > 500 ? "solve-slow" : "solve-fast"}">${item.solveTimeMs} ms</span>` : `<span class="muted">-</span>`}</td>
      <td class="mono">${item.pair}</td>
      <td><span class="mono">${item.tradeSizeDisplay || "-"}</span><br><span class="muted">$${number(item.tradeSizeUsd, 0)}</span></td>
      <td class="route">${item.route.length ? item.route.join(" → ") : `<span class="muted">No solution submitted</span>`}</td>
      <td class="mono">${item.blockNumber}</td>
      <td class="mono">${short(item.auctionId)}</td>
      <td class="mono">${item.solverCommit}</td>
      <td>${traceBadge(item)}</td>
      <td><span class="links">${verificationLinks(item)}</span></td>
    `;
    els.feedBody.append(row);

    if (expandedId === item.auctionId) {
      els.feedBody.append(detailsRow(item));
    }
  });
}

function detailsRow(item) {
  const template = document.querySelector("#routeDetailsTemplate");
  const node = template.content.firstElementChild.cloneNode(true);
  node.querySelector(".details-meta").innerHTML = `
    <span>Auction <span class="mono">${item.auctionId}</span></span>
    <span>Block <span class="mono">${item.blockNumber}</span></span>
    <span>Solve <span class="mono">${item.solveTimeMs || "-"} ms</span></span>
    <span>Trace <span class="mono">${item.routeTrace.status}</span></span>
    <span>Chosen because <span class="mono">${item.routeTrace.chosenReason}</span></span>
  `;
  const body = node.querySelector(".candidate-list");
  if (!item.routeTrace.candidates.length) {
    body.innerHTML = `<div class="empty-state"><strong>No route trace captured yet.</strong><span>This event is waiting for candidate-route evidence.</span></div>`;
  }

  item.routeTrace.candidates.forEach((candidate) => {
    const row = document.createElement("article");
    row.className = `candidate-card ${candidate.chosen ? "is-chosen" : ""}`;
    row.innerHTML = `
      <div class="candidate-rank">#${candidate.rank || ""}</div>
      <div class="candidate-route">
        <strong>${Array.isArray(candidate.route) ? candidate.route.join(" → ") : candidate.route || ""}</strong>
        <span>${candidate.algorithm || ""}</span>
      </div>
      <div class="candidate-stat">
        <span>Output</span>
        <strong>${candidate.estimatedOutput || ""}</strong>
      </div>
      <div class="candidate-stat">
        <span>Net</span>
        <strong>${candidate.netScore || ""}</strong>
      </div>
      <div class="candidate-stat">
        <span>Gas</span>
        <strong>${candidate.gasEth || ""}</strong>
      </div>
      <div class="candidate-stat">
        <span>Hops</span>
        <strong>${candidate.hops ?? ""}</strong>
      </div>
    `;
    body.append(row);
  });
  return node;
}

function traceBadge(item) {
  const { status, candidates } = item.routeTrace;
  const label = status === "complete" ? `${candidates.length} candidates` : status === "partial" ? `${candidates.length} partial` : "pending";
  return `<span class="status route-trace ${status}">${label}</span>`;
}

function verificationLinks(item) {
  const cow = `<a href="${explorers.cow}${item.auctionId}" target="_blank" rel="noreferrer">CoW</a>`;
  const tx = item.settlementTx ? `<a href="${explorers.tx}${item.settlementTx}" target="_blank" rel="noreferrer">Tx</a>` : `<span class="muted">Tx</span>`;
  return `${cow}${tx}`;
}

function renderRawPreview() {
  const blocks = feed.map((item) => item.blockNumber).filter(Boolean);
  const minBlock = blocks.length ? Math.min(...blocks) : 0;
  const maxBlock = blocks.length ? Math.max(...blocks) : 0;

  if (!els.fromBlock.value) els.fromBlock.value = minBlock;
  if (!els.toBlock.value) els.toBlock.value = maxBlock;

  const rows = exportRange();
  els.rawPreview.textContent = JSON.stringify(rows, null, 2);
}

function exportRange() {
  const from = Number(els.fromBlock.value || 0);
  const to = Number(els.toBlock.value || Number.MAX_SAFE_INTEGER);
  return feed.filter((item) => item.blockNumber >= from && item.blockNumber <= to);
}

function csv(rows) {
  const columns = ["auctionId", "blockNumber", "solverCommit", "pair", "tradeSizeUsd", "solveTimeMs", "outcome", "route", "settlementTx", "routeTraceStatus", "candidateCount", "chosenReason"];
  const lines = [columns.join(",")];
  rows.forEach((item) => {
    lines.push([
      item.auctionId,
      item.blockNumber,
      item.solverCommit,
      item.pair,
      item.tradeSizeUsd,
      item.solveTimeMs ?? "",
      item.outcome,
      item.route.join(" -> "),
      item.settlementTx ?? "",
      item.routeTrace.status,
      item.routeTrace.candidates.length,
      item.routeTrace.chosenReason,
    ].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","));
  });
  return lines.join("\n");
}

function download(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}

function short(value) {
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}

function number(value, digits) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: digits, minimumFractionDigits: digits }).format(value);
}

function compact(value) {
  return new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 2 }).format(value);
}

function setView(view) {
  activeView = view;
  document.querySelectorAll(".view").forEach((node) => node.classList.toggle("is-active", node.id === `${view}View`));
  document.querySelectorAll(".nav-tab").forEach((node) => {
    const active = node.dataset.view === view;
    node.classList.toggle("is-active", active);
    if (active) node.setAttribute("aria-current", "page");
    else node.removeAttribute("aria-current");
  });
}

document.querySelectorAll(".nav-tab").forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view));
});

els.feedBody.addEventListener("click", (event) => {
  const button = event.target.closest("[data-expand]");
  if (!button) return;
  expandedId = expandedId === button.dataset.expand ? null : button.dataset.expand;
  renderFeed();
});

els.pauseButton.addEventListener("click", () => {
  paused = !paused;
  document.querySelectorAll(".live-dot").forEach((dot) => dot.classList.toggle("is-paused", paused));
  els.streamStateText.textContent = paused ? "Stream paused" : "Streaming every block";
  els.pauseButton.setAttribute("aria-label", paused ? "Resume live stream" : "Pause live stream");
});

els.outcomeFilter.addEventListener("change", renderFeed);
els.traceFilter.addEventListener("change", renderFeed);
els.fromBlock.addEventListener("input", renderRawPreview);
els.toBlock.addEventListener("input", renderRawPreview);

document.querySelector("#downloadVisible").addEventListener("click", () => {
  download("fynd-visible-auctions.json", JSON.stringify(filteredFeed(), null, 2), "application/json");
});

document.querySelector("#downloadJson").addEventListener("click", () => {
  download("fynd-auctions.json", JSON.stringify(exportRange(), null, 2), "application/json");
});

document.querySelector("#downloadCsv").addEventListener("click", () => {
  download("fynd-auctions.csv", csv(exportRange()), "text/csv");
});

loadEvents();
refreshServiceStatus();
setInterval(() => {
  if (!paused) loadEvents();
}, 5000);
setInterval(refreshServiceStatus, 30000);
