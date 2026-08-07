"use client";

import identity from "@/data/beverly/identity.json";

const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
const ordinal = (n: number) => {
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

function ChartCard({ children, title, note }: { children: React.ReactNode; title?: string; note?: React.ReactNode }) {
  return (
    <div className="my-8 rounded-md border border-rule bg-bg-card/50 px-5 py-5 sm:px-6">
      {title && <h3 className="mb-4 font-display text-lg font-semibold text-ink">{title}</h3>}
      {children}
      {note && <p className="mt-4 max-w-[64ch] border-t border-rule pt-3 text-[0.8125rem] leading-relaxed text-ink-faint">{note}</p>}
    </div>
  );
}

function RankChip({ rank }: { rank: number }) {
  const low = rank >= 6;
  return (
    <span
      className="ml-auto shrink-0 rounded-full px-2 py-0.5 text-[0.6875rem] font-bold tabular-nums"
      style={{
        background: low ? "color-mix(in srgb, var(--color-debt) 14%, transparent)" : "var(--color-bg)",
        color: low ? "var(--color-debt)" : "var(--color-ink-faint)",
        border: low ? "none" : "1px solid var(--color-rule)",
      }}
    >
      {ordinal(rank)} of 7
    </span>
  );
}

// ---- 1. Spending by function: Beverly bar vs peer-median marker ----
export function FunctionSpendingChart() {
  const rows = identity.functionSpending;
  return (
    <ChartCard
      title="Spending per resident, by function"
      note={
        <>
          Averages, FY2014 through FY2024, per resident. The bar is Beverly; the marker is the peer median of the seven towns.
          Beverly sits below the median on every core function and above it only on culture. Rank 1 is the highest spender. Source:
          Massachusetts Division of Local Services, Schedule A.
        </>
      }
    >
      <div className="mb-3 flex flex-wrap gap-x-5 gap-y-1 text-[0.78125rem]">
        <span className="inline-flex items-center gap-1.5">
          <i className="inline-block h-2.5 w-4 rounded-sm bg-accent" /> Beverly
        </span>
        <span className="inline-flex items-center gap-1.5">
          <i className="inline-block h-3.5 w-[3px] bg-ink" /> Peer median
        </span>
      </div>
      <div className="flex flex-col gap-2.5">
        {rows.map((r) => {
          const max = Math.max(r.bev, r.med) * 1.14;
          const bevW = (r.bev / max) * 100;
          const medX = (r.med / max) * 100;
          const above = r.bev > r.med;
          return (
            <div key={r.fn} className="grid grid-cols-[minmax(96px,132px)_1fr] items-center gap-2 sm:grid-cols-[150px_1fr]">
              <div className="text-[0.8125rem] leading-tight text-ink">{r.fn}</div>
              <div className="flex items-center gap-2.5">
                <div className="relative h-6 flex-1 overflow-visible rounded-sm bg-black/[0.04]">
                  <div
                    className="absolute inset-y-0 left-0 rounded-sm"
                    style={{ width: `${bevW}%`, background: above ? "var(--color-gold-strong)" : "var(--color-accent)" }}
                  />
                  <div className="absolute inset-y-[-3px] w-[3px] bg-ink" style={{ left: `calc(${medX}% - 1.5px)` }} />
                </div>
                <div className="flex w-[118px] shrink-0 items-center gap-1.5">
                  <span className="text-[0.8125rem] font-bold tabular-nums text-ink">{usd(r.bev)}</span>
                  <RankChip rank={r.rank} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ChartCard>
  );
}

// ---- 2. School funding stack: aid + required + added-on-top ----
export function SchoolFundingStack() {
  const rows = identity.schoolFunding;
  const maxTotal = Math.max(...rows.map((r) => r.aid + r.req + r.add)) * 1.02;
  const seg = [
    { key: "aid" as const, label: "State aid", color: "var(--color-ink-faint)" },
    { key: "req" as const, label: "Required local", color: "color-mix(in srgb, var(--color-ink) 55%, var(--color-bg))" },
    { key: "add" as const, label: "Added on top (the choice)", color: "var(--color-accent)" },
  ];
  return (
    <ChartCard
      title="Who pays for the schools, per pupil"
      note={
        <>
          Per pupil, FY2025, sorted by the green segment. State aid plus the required local contribution make up the foundation
          budget the state sets; <b className="text-ink">added on top</b>{" "}is what each town chose to spend beyond it. Beverly&apos;s
          added spending is second from the bottom, ahead of only Peabody, though the state already expects it to cover one of the
          largest local shares in the group. Source: Massachusetts Department of Elementary and Secondary Education, Chapter 70.
        </>
      }
    >
      <div className="mb-3.5 flex flex-wrap gap-x-4 gap-y-1.5 text-[0.75rem]">
        {seg.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1.5">
            <i className="inline-block h-2.5 w-4 rounded-sm" style={{ background: s.color }} /> {s.label}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {rows.map((r) => {
          const total = r.aid + r.req + r.add;
          return (
            <div key={r.town} className="grid grid-cols-[84px_1fr] items-center gap-2 sm:grid-cols-[96px_1fr]">
              <div className={`text-[0.8125rem] leading-tight ${r.me ? "font-bold text-ink" : "text-ink-mid"}`}>{r.town}</div>
              <div className="flex items-center gap-2">
                <div
                  className="flex h-7 overflow-hidden rounded-sm"
                  style={{ width: `${(total / maxTotal) * 100}%`, outline: r.me ? "2px solid var(--color-accent)" : "none", outlineOffset: 1 }}
                >
                  {seg.map((s, i) => (
                    <div
                      key={s.key}
                      style={{
                        width: `${(r[s.key] / total) * 100}%`,
                        background: s.color,
                        marginLeft: i > 0 ? 2 : 0,
                      }}
                      title={`${s.label}: ${usd(r[s.key])}`}
                    />
                  ))}
                </div>
                <span className="shrink-0 text-[0.78125rem] font-bold tabular-nums text-accent">{usd(r.add)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </ChartCard>
  );
}

// ---- 3. Receipts: smallest yearly overshoot, diverging around zero ----
export function ReceiptsChart() {
  const rows = identity.receipts;
  const maxNeg = Math.max(0, ...rows.map((r) => -r.pct));
  const maxPos = Math.max(...rows.map((r) => r.pct));
  const span = maxNeg + maxPos;
  const zeroX = (maxNeg / span) * 100;
  return (
    <ChartCard
      title="How far each town's revenue beats its own forecast"
      note={
        <>
          Local receipts, actual collections versus the town&apos;s own estimate, FY2018 through FY2024, showing each town&apos;s
          <em> smallest</em> overshoot in any single year. Even in the year it forecast most accurately, Beverly still collected 21
          percent more than it budgeted, the most conservative floor in the cohort. Source: DLS, local receipt estimate versus actual.
        </>
      }
    >
      <div className="flex flex-col gap-1.5">
        {rows.map((r) => {
          const neg = r.pct < 0;
          const w = (Math.abs(r.pct) / span) * 100;
          return (
            <div key={r.town} className="grid grid-cols-[84px_1fr_56px] items-center gap-2 sm:grid-cols-[96px_1fr_56px]">
              <div className={`text-[0.8125rem] ${r.me ? "font-bold text-ink" : "text-ink-mid"}`}>{r.town}</div>
              <div className="relative h-5">
                <div className="absolute inset-y-[-3px] w-px bg-ink/40" style={{ left: `${zeroX}%` }} />
                <div
                  className="absolute inset-y-0 rounded-sm"
                  style={{
                    left: neg ? `calc(${zeroX}% - ${w}%)` : `${zeroX}%`,
                    width: `${w}%`,
                    background: neg ? "var(--color-debt)" : r.me ? "var(--color-accent)" : "color-mix(in srgb, var(--color-accent) 42%, var(--color-bg))",
                  }}
                />
              </div>
              <div className={`text-right text-[0.78125rem] font-bold tabular-nums ${neg ? "text-debt" : r.me ? "text-accent" : "text-ink-faint"}`}>
                {r.pct > 0 ? "+" : ""}
                {r.pct}%
              </div>
            </div>
          );
        })}
      </div>
    </ChartCard>
  );
}

// ---- 4. Pension: funded ratio + payoff year ----
export function PensionTable() {
  const rows = identity.pension;
  return (
    <ChartCard
      title="Pension: how funded, and how soon paid off"
      note={
        <>
          Funded ratio and the fiscal year each system finishes paying down its unfunded liability, from PERAC. Every town beats the
          state&apos;s FY2040 deadline; Beverly is tied for the best-funded and among the earliest to finish, though 75 percent is only
          the statewide median. Paying early means a heavier bill in the years right before it ends.
        </>
      }
    >
      <div className="flex flex-col gap-2">
        {rows.map((r) => (
          <div key={r.town} className="grid grid-cols-[84px_1fr_auto] items-center gap-3 sm:grid-cols-[96px_1fr_auto]">
            <div className={`text-[0.8125rem] ${r.me ? "font-bold text-ink" : "text-ink-mid"}`}>{r.town}</div>
            <div className="flex items-center gap-2.5">
              <div className="h-5 flex-1 overflow-hidden rounded-sm bg-black/[0.04]">
                <div
                  className="h-full rounded-sm"
                  style={{ width: `${r.funded}%`, background: r.me ? "var(--color-accent)" : "color-mix(in srgb, var(--color-accent) 42%, var(--color-bg))" }}
                />
              </div>
              <span className={`w-12 shrink-0 text-[0.78125rem] font-bold tabular-nums ${r.me ? "text-accent" : "text-ink-faint"}`}>{r.funded}%</span>
            </div>
            <span
              className="shrink-0 rounded-full border border-rule px-2.5 py-0.5 text-[0.75rem] font-semibold tabular-nums text-ink-mid"
              style={r.me ? { borderColor: "var(--color-accent)", color: "var(--color-accent)" } : undefined}
            >
              {r.payoff}
            </span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

// ---- 5. FY2024 free cash disposition ----
export function FreeCashDisposition() {
  const rows = identity.freeCash2024;
  const total = rows.reduce((s, r) => s + r.amt, 0);
  const kindColor: Record<string, string> = {
    capital: "var(--color-gold-strong)",
    reserve: "var(--color-accent)",
    restricted: "color-mix(in srgb, var(--color-ink) 40%, var(--color-bg))",
  };
  const groups = [
    { kind: "capital", label: "Capital" },
    { kind: "reserve", label: "Reserves" },
    { kind: "restricted", label: "Restricted" },
  ].map((g) => ({ ...g, sum: rows.filter((r) => r.kind === g.kind).reduce((s, r) => s + r.amt, 0) }));
  return (
    <ChartCard
      title="Where the FY2024 surplus went"
      note={
        <>
          The seven Beverly City Council orders that appropriated FY2024 certified free cash, about $7.7 million of an $11.4
          million pool. Two-thirds went to capital, a third to reserves. That is the allocation the state prescribes for one-time
          money, so this split is not itself a criticism. The remaining $3.6 million was left unspent and recertified as free cash
          the next year. Source: Beverly City Council orders, FY2024.
        </>
      }
    >
      <div className="mb-4 flex h-8 overflow-hidden rounded-md">
        {groups
          .filter((g) => g.sum > 0)
          .map((g, i) => (
            <div
              key={g.kind}
              className="flex items-center justify-center text-[0.6875rem] font-bold text-white"
              style={{ width: `${(g.sum / total) * 100}%`, background: kindColor[g.kind], marginLeft: i > 0 ? 2 : 0 }}
              title={`${g.label}: ${g.sum.toFixed(2)}M`}
            >
              {g.sum / total > 0.12 ? `${Math.round((g.sum / total) * 100)}%` : ""}
            </div>
          ))}
      </div>
      <ul className="flex flex-col divide-y divide-rule">
        {rows.map((r) => (
          <li key={r.use} className="flex items-center gap-3 py-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: kindColor[r.kind] }} />
            <span className="flex-1 text-[0.875rem] leading-tight text-ink">{r.use}</span>
            <span className="shrink-0 text-[0.84375rem] font-bold tabular-nums text-ink">{`$${r.amt}M`}</span>
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}

// ---- small: the stabilization leap ----
// The 2013 and 2022 points are the general stabilization fund from the DLS trend report,
// which ends at FY2022; latest.general is the same fund at FY2025, so the multiple is
// like-for-like. The every-year claim stays scoped to the years the trend report covers.
const STAB = identity.reserves.stabilization;

export function StabilizationLeap() {
  const fold = Math.round(STAB.latest.general / STAB.start.amt);
  return (
    <div className="my-8 flex flex-col items-stretch gap-3 rounded-md border border-rule bg-bg-card/50 px-5 py-5 sm:flex-row sm:items-center sm:gap-6">
      <div className="flex items-center gap-3">
        <div>
          <div className="text-[0.6875rem] font-semibold uppercase tracking-wide text-ink-faint">{STAB.start.year}</div>
          <div className="font-display text-2xl font-bold tabular-nums text-ink-mid">
            ${Math.round(STAB.start.amt / 1000)}K
          </div>
        </div>
        <span className="font-display text-2xl text-accent">→</span>
        <div>
          <div className="text-[0.6875rem] font-semibold uppercase tracking-wide text-ink-faint">
            FY{STAB.latest.fy}
          </div>
          <div className="font-display text-3xl font-extrabold tabular-nums text-accent">
            ${(STAB.latest.general / 1e6).toFixed(1)}M
          </div>
        </div>
      </div>
      <p className="text-[0.90625rem] leading-snug text-ink-mid sm:border-l sm:border-rule sm:pl-6">
        Beverly&apos;s stabilization fund, its rainy-day account, grew{" "}
        <b className="text-ink">every single year</b>{" "}the state&apos;s trend report covers, {STAB.start.year} through{" "}
        {STAB.trendEnd.year}, and it is higher again by FY{STAB.latest.fy}. A {fold}-fold rise. Nothing else in the
        budget moved like it.
      </p>
    </div>
  );
}
