"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import type { GameState, Idea } from "./store";

const API = "/experiments/thanksgiving/api";
const POLL_MS = 3000;
const TOAST_MS = 5000;
const MAX_LEN = 80;
const MINE_KEY = "tg2026:mine";

type Sort = "added" | "most";
type Toast = { id: string; text: string; d: 1 | -1 } | null;

function loadMine(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(MINE_KEY) ?? "{}") ?? {};
  } catch {
    return {};
  }
}

// Ideas this phone added, id -> removal key. Read through useSyncExternalStore so the server
// render (no localStorage) and the first client render agree.
let mineCache: Record<string, string> | null = null;
const mineListeners = new Set<() => void>();
const NO_MINE: Record<string, string> = {};

function getMine() {
  return (mineCache ??= loadMine());
}

function subscribeMine(cb: () => void) {
  mineListeners.add(cb);
  return () => {
    mineListeners.delete(cb);
  };
}

function setMine(next: Record<string, string>) {
  mineCache = next;
  try {
    localStorage.setItem(MINE_KEY, JSON.stringify(next));
  } catch {
    // Private mode or blocked storage: the idea still gets added, it just can't be removed
    // from this phone later.
  }
  mineListeners.forEach((l) => l());
}

function ago(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 10) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  return `${Math.round(m / 60)}h ago`;
}

export default function Game({ initial }: { initial: GameState | null }) {
  const [state, setState] = useState<GameState | null>(initial);
  const [offline, setOffline] = useState(false);
  const [notConfigured, setNotConfigured] = useState(false);
  const [pending, setPending] = useState<Record<string, number>>({});
  const mine = useSyncExternalStore(subscribeMine, getMine, () => NO_MINE);
  const [sort, setSort] = useState<Sort>("added");
  const [draft, setDraft] = useState("");
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [toast, setToast] = useState<Toast>(null);
  // Server time, so "2m ago" is right even if a phone's clock is off. Advanced between polls
  // by a timer, using the gap between the server's clock and this phone's.
  const [now, setNow] = useState(initial?.now ?? 0);
  const skew = useRef<number | null>(null);
  // Mutations run one at a time, in order. A poll that started before the latest mutation
  // was queued is thrown away, so a stale board never overwrites a tap in flight.
  const queue = useRef<Promise<unknown>>(Promise.resolve());
  const queued = useRef(0);
  const busy = useRef(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const apply = useCallback((s: GameState) => {
    skew.current = s.now - Date.now();
    setNow(s.now);
    setState(s);
    setOffline(false);
    setNotConfigured(false);
  }, []);

  const handleFailure = useCallback(async (res: Response) => {
    const body = await res.json().catch(() => ({}));
    if (res.status === 503 && body.error === "not-configured") setNotConfigured(true);
    return typeof body.error === "string" ? body.error : "Something went wrong. Try again.";
  }, []);

  const poll = useCallback(async () => {
    if (busy.current > 0) return;
    const seq = queued.current;
    try {
      const res = await fetch(API, { cache: "no-store" });
      if (!res.ok) {
        await handleFailure(res);
        if (res.status !== 503) setOffline(true);
        return;
      }
      const s = (await res.json()) as GameState;
      if (seq === queued.current && busy.current === 0) apply(s);
    } catch {
      setOffline(true);
    }
  }, [apply, handleFailure]);

  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === "visible") poll();
    };
    // No board from the server render (database down or not connected): ask right away.
    const first = initial ? undefined : setTimeout(tick, 0);
    const id = setInterval(tick, POLL_MS);
    document.addEventListener("visibilitychange", tick);
    return () => {
      clearTimeout(first);
      clearInterval(id);
      document.removeEventListener("visibilitychange", tick);
    };
  }, [initial, poll]);

  // Re-render the "x ago" labels between polls.
  useEffect(() => {
    const id = setInterval(() => {
      if (skew.current !== null) setNow(Date.now() + skew.current);
    }, 15000);
    return () => clearInterval(id);
  }, []);

  const mutate = useCallback(
    (payload: Record<string, unknown>) => {
      queued.current += 1;
      busy.current += 1;
      const job = queue.current.then(async () => {
        try {
          const res = await fetch(API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) return { error: await handleFailure(res) };
          const s = (await res.json()) as GameState & { added?: { id: string; key: string } };
          apply(s);
          return { added: s.added };
        } catch {
          setOffline(true);
          return { error: "Couldn’t reach the scoreboard. Check your signal and try again." };
        } finally {
          busy.current -= 1;
        }
      });
      queue.current = job;
      return job;
    },
    [apply, handleFailure],
  );

  const showToast = (t: Toast) => {
    clearTimeout(toastTimer.current);
    setToast(t);
    toastTimer.current = setTimeout(() => setToast(null), TOAST_MS);
  };

  const tap = (idea: Idea, d: 1 | -1) => {
    setPending((p) => ({ ...p, [idea.id]: (p[idea.id] ?? 0) + d }));
    if (d === 1) showToast({ id: idea.id, text: idea.text, d });
    else setToast(null);
    mutate({ action: "tap", id: idea.id, delta: d }).finally(() =>
      setPending((p) => {
        const next = { ...p, [idea.id]: (p[idea.id] ?? 0) - d };
        if (next[idea.id] === 0) delete next[idea.id];
        return next;
      }),
    );
  };

  const undo = () => {
    if (!toast || !state) return;
    const idea = state.ideas.find((i) => i.id === toast.id);
    clearTimeout(toastTimer.current);
    setToast(null);
    if (idea) tap(idea, -1);
  };

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = draft.replace(/\s+/g, " ").trim();
    if (!text) return;
    setAdding(true);
    setAddError("");
    const out = await mutate({ action: "add", text });
    setAdding(false);
    if (out.error) {
      setAddError(out.error);
      return;
    }
    setDraft("");
    if (out.added) setMine({ ...getMine(), [out.added.id]: out.added.key });
  };

  const remove = async (idea: Idea) => {
    const key = mine[idea.id];
    if (!key) return;
    const n = count(idea);
    const msg =
      n > 0
        ? `Take “${idea.text}” off the board? Its ${n} ${n === 1 ? "drink goes" : "drinks go"} with it.`
        : `Take “${idea.text}” off the board?`;
    if (!window.confirm(msg)) return;
    const out = await mutate({ action: "remove", id: idea.id, key });
    if (!out.error) {
      const next = { ...getMine() };
      delete next[idea.id];
      setMine(next);
    }
  };

  const count = (i: Idea) => Math.max(0, i.count + (pending[i.id] ?? 0));

  const ideas = useMemo(() => {
    const list = state?.ideas ?? [];
    if (sort === "added") return list;
    return [...list].sort(
      (a, b) =>
        Math.max(0, b.count + (pending[b.id] ?? 0)) - Math.max(0, a.count + (pending[a.id] ?? 0)) ||
        a.createdAt - b.createdAt,
    );
  }, [state, sort, pending]);

  const total = ideas.reduce((sum, i) => sum + count(i), 0);
  const max = ideas.reduce((m, i) => Math.max(m, count(i)), 0);
  const hit = ideas.filter((i) => count(i) > 0).length;

  return (
    <div className="mx-auto max-w-xl px-4 pb-32 pt-8 sm:px-6 sm:pt-12">
      <p className="text-[0.8125rem] uppercase tracking-[0.12em] text-debt">Thanksgiving 2026</p>
      <h1 className="mt-1 font-display text-[2.25rem] font-bold leading-[1.05] tracking-tight sm:text-5xl">
        The drinking game
      </h1>
      <p className="mt-3 text-ink-mid leading-relaxed">
        Add the things that are bound to happen at dinner. When one does, tap it. Each tap is a
        point, and a drink.
      </p>

      {notConfigured && (
        <p role="alert" className="mt-6 rounded-lg border border-debt/40 bg-debt/10 px-4 py-3 text-[0.9375rem] text-debt">
          The scoreboard isn’t connected to its database yet. Nothing can be saved until it is.
        </p>
      )}

      {/* Scoreboard */}
      <section aria-label="Score" className="mt-7 flex items-end justify-between gap-4 rounded-xl bg-bg-card px-5 py-4">
        <div>
          <div className="font-display text-6xl font-bold leading-none tabular-nums text-debt" aria-live="polite">
            {total}
          </div>
          <div className="mt-1.5 text-ink-mid">
            {total === 1 ? "drink" : "drinks"} so far
          </div>
        </div>
        <div className="pb-0.5 text-right text-[0.875rem] leading-snug text-ink-mid">
          <div>
            <span className="tabular-nums">{hit}</span> of{" "}
            <span className="tabular-nums">{ideas.length}</span> {ideas.length === 1 ? "has" : "have"} happened
          </div>
          <div className="mt-1 flex items-center justify-end gap-1.5 text-ink-faint">
            <span
              aria-hidden
              className={`inline-block h-2 w-2 rounded-full ${offline ? "bg-gold" : "bg-accent-lt animate-pulse"}`}
            />
            {offline ? "Reconnecting…" : "Live"}
          </div>
        </div>
      </section>

      {/* Add */}
      <form onSubmit={add} className="mt-6">
        <label htmlFor="tg-new" className="block font-display text-lg font-bold">
          Drink when…
        </label>
        <div className="mt-2 flex gap-2">
          <input
            id="tg-new"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              if (addError) setAddError("");
            }}
            maxLength={MAX_LEN}
            autoComplete="off"
            enterKeyHint="done"
            placeholder="e.g. someone brings up the Patriots"
            aria-describedby={addError ? "tg-err" : undefined}
            className="min-w-0 flex-1 rounded-lg border border-ink/20 bg-white/70 px-3.5 py-3 text-base text-ink placeholder:text-ink-faint focus:border-debt focus:outline-none focus:ring-2 focus:ring-debt/30"
          />
          <button
            type="submit"
            disabled={adding || !draft.trim()}
            className="shrink-0 rounded-lg bg-debt px-5 py-3 font-display font-bold text-white transition-opacity disabled:opacity-40"
          >
            {adding ? "Adding…" : "Add"}
          </button>
        </div>
        <div className="mt-1.5 flex justify-between gap-3 text-[0.8125rem]">
          <span id="tg-err" role="alert" className="text-debt">
            {addError}
          </span>
          {draft.length > MAX_LEN - 20 && (
            <span className="tabular-nums text-ink-faint">{MAX_LEN - draft.length} left</span>
          )}
        </div>
      </form>

      {/* Board */}
      <section aria-label="The board" className="mt-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold">The board</h2>
          {ideas.length > 1 && (
            <div role="group" aria-label="Sort" className="flex rounded-lg bg-bg-card p-0.5 text-[0.875rem]">
              {(
                [
                  ["added", "As added"],
                  ["most", "Most drinks"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={sort === value}
                  onClick={() => setSort(value)}
                  className={`rounded-md px-3 py-1.5 transition-colors ${
                    sort === value ? "bg-bg text-ink shadow-sm" : "text-ink-mid"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}
        </div>

        {state && ideas.length === 0 && (
          <p className="rounded-xl border border-dashed border-ink/20 px-5 py-8 text-center text-ink-mid">
            Nothing on the board yet. Add the first one.
          </p>
        )}
        {!state && !notConfigured && <p className="py-8 text-center text-ink-faint">Loading the board…</p>}

        <ul className="space-y-2">
          {ideas.map((idea) => {
            const n = count(idea);
            const share = max > 0 ? (n / max) * 100 : 0;
            return (
              <li key={idea.id} className="relative overflow-hidden rounded-xl border border-rule bg-bg-card">
                <div
                  aria-hidden
                  className="absolute inset-y-0 left-0 bg-debt/[0.13] transition-[width] duration-500"
                  style={{ width: `${share}%` }}
                />
                <div className="relative flex items-stretch">
                  <button
                    type="button"
                    onClick={() => tap(idea, 1)}
                    aria-label={`${idea.text}. ${n} so far. Tap to add a drink.`}
                    className="flex min-h-[60px] min-w-0 flex-1 items-center gap-3 px-4 py-3 text-left active:bg-debt/10"
                  >
                    <span className="min-w-0 flex-1 break-words leading-snug">{idea.text}</span>
                    <span className="shrink-0 font-display text-2xl font-bold tabular-nums text-debt">{n}</span>
                  </button>
                  {/* Always present, so the counts line up down the board. */}
                  <div className="flex w-11 shrink-0 flex-col justify-center border-l border-rule">
                      {n > 0 && (
                        <button
                          type="button"
                          onClick={() => tap(idea, -1)}
                          aria-label={`Take one drink off “${idea.text}”`}
                          className="flex-1 text-lg leading-none text-ink-mid active:bg-debt/10"
                        >
                          −
                        </button>
                      )}
                      {mine[idea.id] && (
                        <button
                          type="button"
                          onClick={() => remove(idea)}
                          aria-label={`Remove “${idea.text}” from the board`}
                          className="flex-1 text-[0.75rem] text-ink-faint active:bg-debt/10"
                        >
                          ✕
                        </button>
                      )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
        {ideas.length > 0 && (
          <p className="mt-3 text-[0.8125rem] text-ink-faint">
            Tap a line when it happens. − fixes a wrong tap. ✕ shows on ideas you added.
          </p>
        )}
      </section>

      {/* Latest */}
      {state && state.log.length > 0 && (
        <section aria-label="Latest" className="mt-10">
          <h2 className="font-display text-lg font-bold">Latest</h2>
          <ul className="mt-2 divide-y divide-rule text-[0.9375rem]">
            {state.log.slice(0, 8).map((e, i) => (
              <li key={`${e.at}-${e.id}-${i}`} className="flex items-baseline gap-3 py-2">
                <span className={`w-6 shrink-0 font-display font-bold tabular-nums ${e.d > 0 ? "text-debt" : "text-ink-faint"}`}>
                  {e.d > 0 ? "+1" : "−1"}
                </span>
                <span className="min-w-0 flex-1 truncate text-ink-mid">{e.text}</span>
                <span className="shrink-0 text-[0.8125rem] text-ink-faint">{ago(now - e.at)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Undo toast */}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        {toast && (
          <div className="pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-xl bg-ink px-4 py-3 text-bg shadow-lg">
            <span className="font-display font-bold text-gold">+1</span>
            <span className="min-w-0 flex-1 truncate">{toast.text}</span>
            <button type="button" onClick={undo} className="shrink-0 font-display font-bold underline underline-offset-2">
              Undo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
