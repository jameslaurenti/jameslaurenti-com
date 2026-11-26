/**
 * Shared state for the Thanksgiving drinking game, kept in Upstash Redis (Vercel Marketplace).
 * Connecting the database to the Vercel project sets KV_REST_API_URL and KV_REST_API_TOKEN
 * (or the UPSTASH_REDIS_REST_* pair), and nothing else here needs configuring.
 *
 * Every key carries the year, so next November starts from an empty board.
 *
 *   tg2026:ideas   hash   id -> JSON { id, text, createdAt, key }
 *   tg2026:counts  hash   id -> number of times it has happened
 *   tg2026:log     list   newest-first JSON { id, text, d, at }, trimmed to LOG_LENGTH
 *
 * `key` is a random secret handed only to the device that added the idea, so that device
 * can take it back off the board. It never leaves the server otherwise.
 *
 * Without the env vars, development falls back to an in-memory store so the page can be
 * run locally. Production without them returns NotConfigured, and the page says so.
 */

const PREFIX = "tg2026";
const K_IDEAS = `${PREFIX}:ideas`;
const K_COUNTS = `${PREFIX}:counts`;
const K_LOG = `${PREFIX}:log`;

export const MAX_IDEA_LENGTH = 80;
const MAX_IDEAS = 150;
const LOG_LENGTH = 25;

export type Idea = { id: string; text: string; createdAt: number; count: number };
export type LogEntry = { id: string; text: string; d: 1 | -1; at: number };
export type GameState = { ideas: Idea[]; log: LogEntry[]; total: number; now: number };

type StoredIdea = { id: string; text: string; createdAt: number; key: string };
type Command = (string | number)[];

export class NotConfigured extends Error {}
export class GameError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

/* ----------------------------------------------------------------------------------------
 * Transport: Upstash REST pipeline, or the in-memory stand-in for local development
 * ------------------------------------------------------------------------------------- */

const REST_URL = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

async function run(commands: Command[]): Promise<unknown[]> {
  if (REST_URL && REST_TOKEN) {
    const res = await fetch(`${REST_URL.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${REST_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(commands),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Redis responded ${res.status}`);
    const out = (await res.json()) as { result?: unknown; error?: string }[];
    return out.map((r) => {
      if (r.error) throw new Error(`Redis: ${r.error}`);
      return r.result;
    });
  }
  if (process.env.NODE_ENV !== "production") return commands.map(memory);
  throw new NotConfigured("No database connected");
}

// Just enough Redis for this file, for `next dev` without a database.
const mem = ((globalThis as { __tgMem?: Map<string, Map<string, string> | string[]> }).__tgMem ??=
  new Map());

function memory([cmd, key, ...args]: Command): unknown {
  const k = String(key);
  const hash = () => {
    let h = mem.get(k);
    if (!(h instanceof Map)) mem.set(k, (h = new Map()));
    return h;
  };
  const list = () => {
    let l = mem.get(k);
    if (!Array.isArray(l)) mem.set(k, (l = []));
    return l;
  };
  switch (cmd) {
    case "HGETALL":
      return [...hash()].flat();
    case "HGET":
      return hash().get(String(args[0])) ?? null;
    case "HSET":
      hash().set(String(args[0]), String(args[1]));
      return 1;
    case "HDEL":
      return hash().delete(String(args[0])) ? 1 : 0;
    case "HLEN":
      return hash().size;
    case "HINCRBY": {
      const h = hash();
      const next = Number(h.get(String(args[0])) ?? 0) + Number(args[1]);
      h.set(String(args[0]), String(next));
      return next;
    }
    case "LPUSH":
      list().unshift(String(args[0]));
      return list().length;
    case "LTRIM":
      mem.set(k, list().slice(Number(args[0]), Number(args[1]) + 1));
      return "OK";
    case "LRANGE":
      return list().slice(Number(args[0]), Number(args[1]) + 1);
    default:
      throw new Error(`memory store: ${cmd} not implemented`);
  }
}

/* ----------------------------------------------------------------------------------------
 * Game operations
 * ------------------------------------------------------------------------------------- */

function pairs(flat: unknown): [string, string][] {
  const a = Array.isArray(flat) ? (flat as string[]) : [];
  const out: [string, string][] = [];
  for (let i = 0; i + 1 < a.length; i += 2) out.push([a[i], a[i + 1]]);
  return out;
}

function parse<T>(s: string): T | null {
  try {
    return JSON.parse(s) as T;
  } catch {
    return null;
  }
}

function randomId(bytes: number) {
  const b = crypto.getRandomValues(new Uint8Array(bytes));
  return Array.from(b, (x) => x.toString(16).padStart(2, "0")).join("");
}

export function cleanText(raw: unknown): string {
  return typeof raw === "string" ? raw.replace(/\s+/g, " ").trim() : "";
}

async function readIdeas(): Promise<StoredIdea[]> {
  const [flat] = await run([["HGETALL", K_IDEAS]]);
  return pairs(flat)
    .map(([, v]) => parse<StoredIdea>(v))
    .filter((x): x is StoredIdea => x !== null);
}

export async function getState(): Promise<GameState> {
  const [ideasFlat, countsFlat, logRaw] = await run([
    ["HGETALL", K_IDEAS],
    ["HGETALL", K_COUNTS],
    ["LRANGE", K_LOG, 0, LOG_LENGTH - 1],
  ]);
  const counts = new Map(pairs(countsFlat).map(([id, n]) => [id, Math.max(0, Number(n) || 0)]));
  const ideas = pairs(ideasFlat)
    .map(([, v]) => parse<StoredIdea>(v))
    .filter((x): x is StoredIdea => x !== null)
    .map(({ id, text, createdAt }) => ({ id, text, createdAt, count: counts.get(id) ?? 0 }))
    .sort((a, b) => a.createdAt - b.createdAt);
  const live = new Set(ideas.map((i) => i.id));
  const log = (Array.isArray(logRaw) ? (logRaw as string[]) : [])
    .map((s) => parse<LogEntry>(s))
    .filter((x): x is LogEntry => x !== null && live.has(x.id));
  const total = ideas.reduce((sum, i) => sum + i.count, 0);
  return { ideas, log, total, now: Date.now() };
}

export async function addIdea(rawText: unknown): Promise<{ id: string; key: string }> {
  const text = cleanText(rawText);
  if (!text) throw new GameError("Write something first.", 400);
  if (text.length > MAX_IDEA_LENGTH) {
    throw new GameError(`Keep it under ${MAX_IDEA_LENGTH} characters.`, 400);
  }
  const existing = await readIdeas();
  if (existing.length >= MAX_IDEAS) throw new GameError("The board is full.", 409);
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "");
  if (existing.some((i) => norm(i.text) === norm(text))) {
    throw new GameError("That one’s already on the board.", 409);
  }
  const idea: StoredIdea = { id: randomId(6), text, createdAt: Date.now(), key: randomId(16) };
  await run([
    ["HSET", K_IDEAS, idea.id, JSON.stringify(idea)],
    ["HSET", K_COUNTS, idea.id, 0],
  ]);
  return { id: idea.id, key: idea.key };
}

export async function tap(id: unknown, delta: unknown): Promise<void> {
  if (typeof id !== "string" || (delta !== 1 && delta !== -1)) {
    throw new GameError("Bad request.", 400);
  }
  const [raw] = await run([["HGET", K_IDEAS, id]]);
  const idea = typeof raw === "string" ? parse<StoredIdea>(raw) : null;
  if (!idea) throw new GameError("That idea was removed.", 404);

  const [next] = await run([["HINCRBY", K_COUNTS, id, delta]]);
  if (Number(next) < 0) {
    // Two people undid the same tap at once. Floor at zero and don't log it.
    await run([["HSET", K_COUNTS, id, 0]]);
    return;
  }
  const entry: LogEntry = { id, text: idea.text, d: delta, at: Date.now() };
  await run([
    ["LPUSH", K_LOG, JSON.stringify(entry)],
    ["LTRIM", K_LOG, 0, LOG_LENGTH - 1],
  ]);
}

export async function removeIdea(id: unknown, key: unknown): Promise<void> {
  if (typeof id !== "string" || typeof key !== "string") throw new GameError("Bad request.", 400);
  const [raw] = await run([["HGET", K_IDEAS, id]]);
  const idea = typeof raw === "string" ? parse<StoredIdea>(raw) : null;
  if (!idea) return;
  if (idea.key !== key) throw new GameError("Only the phone that added it can remove it.", 403);
  await run([
    ["HDEL", K_IDEAS, id],
    ["HDEL", K_COUNTS, id],
  ]);
}
