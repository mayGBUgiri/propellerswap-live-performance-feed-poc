import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";

const PORT = Number(process.env.PORT || 4173);
const HOST = process.env.HOST || "127.0.0.1";
const TYCHO_API_KEY = process.env.TYCHO_API_KEY;
const TYCHO_RPC_URL = process.env.TYCHO_RPC_URL || "https://tycho-beta.propellerheads.xyz";
const FYND_URL = process.env.FYND_URL || "http://127.0.0.1:3000";
const EVENTS_FILE = join(process.cwd(), "data", "events.json");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url || "/", `http://${req.headers.host}`);

    if (url.pathname === "/api/config") {
      return json(res, {
        tychoConfigured: Boolean(TYCHO_API_KEY),
        tychoRpcUrl: maskHost(TYCHO_RPC_URL),
        fyndUrl: FYND_URL,
      });
    }

    if (url.pathname === "/api/events" && req.method === "GET") {
      return json(res, await readEvents());
    }

    if (url.pathname === "/api/events" && req.method === "POST") {
      const event = await readRequestJson(req);
      const validation = validateEvent(event);
      if (validation) return json(res, { error: validation }, 400);

      const events = await readEvents();
      const next = normalizeEvent(event);
      const index = events.findIndex((item) => item.auctionId === next.auctionId);
      if (index >= 0) events[index] = { ...events[index], ...next, updatedAt: new Date().toISOString() };
      else events.unshift({ ...next, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      await writeEvents(events);
      return json(res, next, index >= 0 ? 200 : 201);
    }

    if (url.pathname === "/api/tycho/health") {
      return await proxyTycho(res, "/v1/health");
    }

    if (url.pathname === "/api/tycho/protocol-systems") {
      return await proxyTycho(res, "/v1/protocol_systems", "POST", {
        chain: url.searchParams.get("chain") || "ethereum",
        pagination: { page: 0, page_size: 100 },
      });
    }

    if (url.pathname === "/api/tycho/tokens") {
      const addresses = url.searchParams.get("addresses");
      return await proxyTycho(res, "/v1/tokens", "POST", {
        chain: url.searchParams.get("chain") || "ethereum",
        min_quality: Number(url.searchParams.get("minQuality") || 75),
        traded_n_days_ago: Number(url.searchParams.get("tradedDays") || 30),
        token_addresses: addresses ? addresses.split(",").map((item) => item.trim()).filter(Boolean) : null,
        pagination: {
          page: Number(url.searchParams.get("page") || 0),
          page_size: Math.min(Number(url.searchParams.get("pageSize") || 20), 100),
        },
      });
    }

    if (url.pathname === "/api/tycho/summary") {
      if (!TYCHO_API_KEY) {
        return json(res, {
          status: "missing_api_key",
          message: "Set TYCHO_API_KEY in the server environment to enable Tycho RPC calls.",
        }, 503);
      }

      const [health, systems, tokens] = await Promise.allSettled([
        fetchTychoJson("/v1/health"),
        fetchTychoJson("/v1/protocol_systems", "POST", {
          chain: "ethereum",
          pagination: { page: 0, page_size: 100 },
        }),
        fetchTychoJson("/v1/tokens", "POST", {
          chain: "ethereum",
          min_quality: 75,
          traded_n_days_ago: 30,
          pagination: { page: 0, page_size: 1 },
        }),
      ]);

      return json(res, {
        health: settledValue(health),
        protocolSystems: settledValue(systems)?.protocol_systems || [],
        tokenTotal: settledValue(tokens)?.pagination?.total ?? null,
      });
    }

    if (url.pathname === "/api/fynd/health") {
      return await proxyJson(res, `${FYND_URL}/v1/health`, {}, "fynd");
    }

    return await staticFile(res, url.pathname);
  } catch (error) {
    return json(res, { error: error.message }, 500);
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Live Performance Feed listening on http://${HOST}:${PORT}/`);
});

async function proxyTycho(res, path, method = "GET", body = undefined) {
  if (!TYCHO_API_KEY) {
    return json(res, {
      status: "missing_api_key",
      message: "Set TYCHO_API_KEY in the server environment to enable Tycho RPC calls.",
    }, 503);
  }

  return proxyJson(res, tychoUrl(path), tychoOptions(method, body), "tycho");
}

async function fetchTychoJson(path, method = "GET", body = undefined) {
  const response = await fetch(tychoUrl(path), tychoOptions(method, body));
  const text = await response.text();
  const payload = text ? JSON.parse(text) : {};
  if (!response.ok) {
    throw new Error(payload.message || payload.error || `Tycho returned ${response.status}`);
  }
  return payload;
}

function tychoUrl(path) {
  return `${TYCHO_RPC_URL.replace(/\/$/, "")}${path}`;
}

function tychoOptions(method, body) {
  return {
    method,
    headers: {
      authorization: TYCHO_API_KEY,
      accept: "application/json",
      ...(body ? { "content-type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  };
}

async function proxyJson(res, url, options, service) {
  try {
    const response = await fetch(url, options);
    const text = await response.text();
    res.writeHead(response.status, {
      "content-type": response.headers.get("content-type") || "application/json; charset=utf-8",
      "cache-control": "no-store",
    });
    res.end(text);
  } catch (error) {
    json(res, {
      service,
      status: "unreachable",
      message: error.message,
    }, 502);
  }
}

async function staticFile(res, pathname) {
  const safePath = normalize(pathname === "/" ? "/index.html" : pathname).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(process.cwd(), safePath);
  let content;
  try {
    content = await readFile(filePath);
  } catch (error) {
    if (error.code === "ENOENT") {
      return json(res, { error: "Not found" }, 404);
    }
    throw error;
  }
  res.writeHead(200, {
    "content-type": mimeTypes[extname(filePath)] || "application/octet-stream",
    "cache-control": "no-store",
  });
  res.end(content);
}

function json(res, payload, status = 200) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  });
  res.end(JSON.stringify(payload, null, 2));
}

function maskHost(value) {
  try {
    const url = new URL(value.startsWith("http") ? value : `https://${value}`);
    return url.host;
  } catch {
    return value;
  }
}

function settledValue(result) {
  return result.status === "fulfilled" ? result.value : { error: result.reason.message };
}

async function readRequestJson(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks).toString("utf8");
  return body ? JSON.parse(body) : {};
}

async function readEvents() {
  try {
    return JSON.parse(await readFile(EVENTS_FILE, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

async function writeEvents(events) {
  await mkdir(join(process.cwd(), "data"), { recursive: true });
  await writeFile(EVENTS_FILE, JSON.stringify(events, null, 2));
}

function validateEvent(event) {
  if (!event || typeof event !== "object") return "Event must be a JSON object.";
  if (!event.auctionId) return "auctionId is required.";
  if (!event.blockNumber) return "blockNumber is required.";
  if (!event.pair) return "pair is required.";
  if (!event.outcome) return "outcome is required.";
  if (!["won", "lost", "timeout"].includes(event.outcome)) return "outcome must be won, lost, or timeout.";
  return null;
}

function normalizeEvent(event) {
  return {
    auctionId: String(event.auctionId),
    blockNumber: Number(event.blockNumber),
    solverCommit: event.solverCommit ? String(event.solverCommit) : "unknown",
    pair: String(event.pair),
    tradeSizeUsd: Number(event.tradeSizeUsd || 0),
    tradeSizeDisplay: event.tradeSizeDisplay || "",
    solveTimeMs: event.solveTimeMs == null ? null : Number(event.solveTimeMs),
    outcome: event.outcome,
    route: Array.isArray(event.route) ? event.route : [],
    settlementTx: event.settlementTx || null,
    routeTrace: {
      status: event.routeTrace?.status || "pending",
      chosenReason: event.routeTrace?.chosenReason || "",
      capturedAt: event.routeTrace?.capturedAt || null,
      candidates: Array.isArray(event.routeTrace?.candidates) ? event.routeTrace.candidates : [],
    },
  };
}
