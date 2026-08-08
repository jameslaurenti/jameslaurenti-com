"use client";

// v2 review copy: forked data so edits here cannot alter the published v1 page.
import identity from "@/data/beverly/identity-v2.json";

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
// Sorted by TOTAL, not by the green segment. Sorting by the discretionary part alone
// made the right-hand number look like it labelled the whole bar, and hid that Beverly
// is sixth of seven on total spending too, not only on the part it chooses.
export function SchoolFundingStack() {
  const rows = [...identity.schoolFunding].sort((a, b) => b.aid + b.req + b.add - (a.aid + a.req + a.add));
  const maxTotal = Math.max(...rows.map((r) => r.aid + r.req + r.add)) * 1.02;
  const seg = [
    { key: "aid" as const, label: "State aid", color: "var(--color-ink-faint)" },
    { key: "req" as const, label: "Required local", color: "color-mix(in srgb, var(--color-ink) 55%, var(--color-bg))" },
    { key: "add" as const, label: "Added by choice", color: "var(--color-accent)" },
  ];
  return (
    <ChartCard
      title="Who pays for the schools, per pupil"
      note={
        <>
          Per pupil, FY2025, sorted by total spending. State aid plus the required local contribution make up the foundation budget
          the state sets; <b className="text-ink">added by choice</b>{" "}is what each town spends beyond it. Beverly is sixth of
          seven on the total and fifth on the part it chooses. Salem shows why both columns matter: a high total built largely on
          state aid, with a small discretionary share. Source: Massachusetts Department of Elementary and Secondary Education,
          Chapter 70.
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
      <div className="mb-1.5 grid grid-cols-[76px_1fr_58px_54px] gap-2 text-[0.625rem] font-bold uppercase tracking-wider text-ink-faint sm:grid-cols-[92px_1fr_66px_60px]">
        <span />
        <span />
        <span className="text-right">Total</span>
        <span className="text-right">Added</span>
      </div>
      <div className="flex flex-col gap-2">
        {rows.map((r) => {
          const total = r.aid + r.req + r.add;
          return (
            <div
              key={r.town}
              className="grid grid-cols-[76px_1fr_58px_54px] items-center gap-2 sm:grid-cols-[92px_1fr_66px_60px]"
            >
              <div className={`text-[0.8125rem] leading-tight ${r.me ? "font-bold text-ink" : "text-ink-mid"}`}>{r.town}</div>
              <div
                className="flex h-7 overflow-hidden rounded-sm"
                style={{ width: `${(total / maxTotal) * 100}%`, outline: r.me ? "2px solid var(--color-accent)" : "none", outlineOffset: 1 }}
              >
                {seg.map((s, i) => (
                  <div
                    key={s.key}
                    style={{ width: `${(r[s.key] / total) * 100}%`, background: s.color, marginLeft: i > 0 ? 2 : 0 }}
                    title={`${s.label}: ${usd(r[s.key])}`}
                  />
                ))}
              </div>
              <span className={`text-right text-[0.78125rem] font-bold tabular-nums ${r.me ? "text-ink" : "text-ink-mid"}`}>
                {usd(total)}
              </span>
              <span className="text-right text-[0.78125rem] font-bold tabular-nums text-accent">{usd(r.add)}</span>
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
  const maxNeg = Math.max(0, ...rows.map((r) => -r.med));
  const maxPos = Math.max(...rows.map((r) => r.med));
  const span = maxNeg + maxPos;
  const zeroX = (maxNeg / span) * 100;
  return (
    <ChartCard
      title="How far each town's revenue beats its own forecast"
      note={
        <>
          Local receipts, actual collections versus the town&apos;s own estimate, FY2018 through FY2024. The bar is the
          <em>typical</em> year, the middle of the seven; the second figure is the <em>floor</em>, each town&apos;s smallest
          overshoot in any single year. Marblehead under-forecasts by more than Beverly in a typical year. What sets Beverly apart
          is the floor: it is the one town that has never had a year where the estimate came close. Source: DLS, local receipt
          estimate versus actual.
        </>
      }
    >
      <div className="mb-1.5 grid grid-cols-[84px_1fr_56px_52px] gap-2 text-[0.625rem] font-bold uppercase tracking-wider text-ink-faint sm:grid-cols-[96px_1fr_56px_58px]">
        <span />
        <span />
        <span className="text-right">Typical</span>
        <span className="text-right">Floor</span>
      </div>
      <div className="flex flex-col gap-1.5">
        {rows.map((r) => {
          const neg = r.med < 0;
          const w = (Math.abs(r.med) / span) * 100;
          return (
            <div key={r.town} className="grid grid-cols-[84px_1fr_56px_52px] items-center gap-2 sm:grid-cols-[96px_1fr_56px_58px]">
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
                {r.med > 0 ? "+" : ""}
                {r.med}%
              </div>
              <div
                className={`text-right text-[0.6875rem] tabular-nums ${r.pct < 0 ? "text-debt" : "text-ink-faint"}`}
                title="smallest overshoot in any single year"
              >
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
// Now covers the whole certified pool rather than only the seven orders. A third of the
// money was never appropriated, which is too large a share to leave out of the picture,
// and the categories are labelled rather than left as unexplained colours.
export function FreeCashDisposition() {
  const rows = identity.freeCash2024;
  const meta = identity.freeCash2024Meta;
  const total = meta.poolM;
  const groups = [
    { kind: "capital", label: "Capital projects", color: "var(--color-gold-strong)" },
    { kind: "reserve", label: "Into reserves", color: "var(--color-accent)" },
    { kind: "restricted", label: "Restricted grant", color: "color-mix(in srgb, var(--color-ink) 40%, var(--color-bg))" },
    { kind: "rollover", label: "Not appropriated", color: "var(--color-cuts)" },
  ].map((g) => ({ ...g, sum: rows.filter((r) => r.kind === g.kind).reduce((s, r) => s + r.amt, 0) }));
  const color = Object.fromEntries(groups.map((g) => [g.kind, g.color])) as Record<string, string>;
  return (
    <ChartCard
      title="Where the FY2024 surplus went"
      note={
        <>
          The whole ${total} million certified pool. Seven Beverly City Council orders appropriated $7.7 million of it; the
          remaining ${meta.rolloverM} million was never appropriated and was recertified as free cash the next year. Capital and
          reserves are the allocation the state prescribes for one-time money, so that split is not itself a criticism. Source:
          Beverly City Council orders, FY2024.
        </>
      }
    >
      <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1.5 text-[0.75rem]">
        {groups.map((g) => (
          <span key={g.kind} className="inline-flex items-center gap-1.5">
            <i className="inline-block h-2.5 w-4 rounded-sm" style={{ background: g.color }} />
            {g.label} <span className="font-bold tabular-nums text-ink">${g.sum.toFixed(2)}M</span>
            <span className="text-ink-faint">({Math.round((g.sum / total) * 100)}%)</span>
          </span>
        ))}
      </div>
      <div className="mb-4 flex h-8 overflow-hidden rounded-md">
        {groups
          .filter((g) => g.sum > 0)
          .map((g, i) => (
            <div
              key={g.kind}
              className="flex items-center justify-center text-[0.6875rem] font-bold text-white"
              style={{ width: `${(g.sum / total) * 100}%`, background: g.color, marginLeft: i > 0 ? 2 : 0 }}
              title={`${g.label}: $${g.sum.toFixed(2)}M`}
            >
              {g.sum / total > 0.12 ? `${Math.round((g.sum / total) * 100)}%` : ""}
            </div>
          ))}
      </div>
      <ul className="flex flex-col divide-y divide-rule">
        {rows.map((r) => (
          <li key={r.use} className="flex items-center gap-3 py-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: color[r.kind] }} />
            <span className="flex-1 text-[0.875rem] leading-tight text-ink">{r.use}</span>
            <span className="shrink-0 text-[0.84375rem] font-bold tabular-nums text-ink">{`$${r.amt}M`}</span>
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}

// ---- 6. Development: how fast, and what kind ----
// Same grammar as the school stack: bar length is the total, segments are the mix.
export function NewGrowthCohort() {
  const { rows, statewideMedianPct } = identity.newGrowthCohort;
  const max = Math.max(...rows.map((r) => r.pace)) * 1.08;
  const seg = [
    { key: "cipPct" as const, label: "Commercial and industrial", color: "var(--color-accent)" },
    { key: "resPct" as const, label: "Residential", color: "color-mix(in srgb, var(--color-ink) 45%, var(--color-bg))" },
  ];
  return (
    <ChartCard
      title="How much new tax base each town adds, and what kind"
      note={
        <>
          New growth as a share of the prior year&apos;s levy, averaged FY2014 to FY2025. Bar length is the pace; the split is what
          the growth was made of. Commercial and industrial growth pays into the levy without adding students or filling the
          streets, so the mix matters as much as the total. The dashed line is the statewide median, about{" "}
          {statewideMedianPct} percent: Beverly is second in its cohort and a little above average for Massachusetts. Source: MA
          DLS New Growth Analysis.
        </>
      }
    >
      <div className="mb-3.5 flex flex-wrap gap-x-4 gap-y-1.5 text-[0.75rem]">
        {seg.map((x) => (
          <span key={x.key} className="inline-flex items-center gap-1.5">
            <i className="inline-block h-2.5 w-4 rounded-sm" style={{ background: x.color }} /> {x.label}
          </span>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {rows.map((r) => (
          <div key={r.town} className="grid grid-cols-[76px_1fr_52px] items-center gap-2 sm:grid-cols-[92px_1fr_56px]">
            <div className={`text-[0.8125rem] leading-tight ${r.me ? "font-bold text-ink" : "text-ink-mid"}`}>{r.town}</div>
            <div className="relative h-6">
              <div
                className="absolute inset-y-[-4px] border-l border-dashed border-ink/45"
                style={{ left: `${(statewideMedianPct / max) * 100}%` }}
                title={`Statewide median ${statewideMedianPct}%`}
              />
              <div
                className="flex h-6 overflow-hidden rounded-sm"
                style={{ width: `${(r.pace / max) * 100}%`, outline: r.me ? "2px solid var(--color-accent)" : "none", outlineOffset: 1 }}
              >
                {seg.map((x, i2) => (
                  <div
                    key={x.key}
                    style={{ width: `${r[x.key]}%`, background: x.color, marginLeft: i2 > 0 ? 2 : 0 }}
                    title={`${x.label}: ${r[x.key]}% of new growth`}
                  />
                ))}
              </div>
            </div>
            <span className={`text-right text-[0.78125rem] font-bold tabular-nums ${r.me ? "text-accent" : "text-ink-faint"}`}>
              {r.pace.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </ChartCard>
  );
}

// ---- 7. Growth in people vs growth in students vs what the classroom feels like ----
export function GrowthVsService() {
  const rows = identity.growthVsService.rows;
  const span = Math.max(...rows.map((r) => Math.max(Math.abs(r.popPct), Math.abs(r.enrPct)))) * 1.1;
  const bar = (v: number, color: string) => {
    const w = (Math.abs(v) / (span * 2)) * 100;
    return (
      <div className="relative h-4">
        <div className="absolute inset-y-[-2px] left-1/2 w-px bg-ink/35" />
        <div
          className="absolute inset-y-0 rounded-sm"
          style={{ left: v < 0 ? `calc(50% - ${w}%)` : "50%", width: `${w}%`, background: color }}
        />
      </div>
    );
  };
  return (
    <ChartCard
      title="More people everywhere, fewer students almost everywhere"
      note={
        <>
          Population change across the 2010 and 2020 censuses, against the change in Chapter 70 foundation enrollment from FY2015
          to FY2024, with FY2024 class size alongside. Every town in the cohort grew. Only Beverly&apos;s schools grew with it, and
          it runs among the fullest classrooms of the seven. Marblehead is the opposite case: modest population growth and a fifth
          of its student body gone. Sources: US Census; DESE Chapter 70 and staffing.
        </>
      }
    >
      <div className="mb-1.5 grid grid-cols-[76px_1fr_1fr_48px] gap-2 text-[0.625rem] font-bold uppercase tracking-wider text-ink-faint sm:grid-cols-[92px_1fr_1fr_54px]">
        <span />
        <span className="text-center">Population</span>
        <span className="text-center">Students</span>
        <span className="text-right">Per tchr</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {rows.map((r) => (
          <div key={r.town} className="grid grid-cols-[76px_1fr_1fr_48px] items-center gap-2 sm:grid-cols-[92px_1fr_1fr_54px]">
            <div className={`text-[0.8125rem] leading-tight ${r.me ? "font-bold text-ink" : "text-ink-mid"}`}>{r.town}</div>
            <div>
              {bar(r.popPct, "var(--color-accent)")}
              <div className="mt-0.5 text-center text-[0.6875rem] tabular-nums text-ink-faint">{r.popPct > 0 ? "+" : ""}{r.popPct}%</div>
            </div>
            <div>
              {bar(r.enrPct, r.enrPct < 0 ? "var(--color-debt)" : "var(--color-accent)")}
              <div className={`mt-0.5 text-center text-[0.6875rem] tabular-nums ${r.enrPct < 0 ? "text-debt" : "text-ink-faint"}`}>
                {r.enrPct > 0 ? "+" : ""}{r.enrPct}%
              </div>
            </div>
            <span className={`text-right text-[0.78125rem] font-bold tabular-nums ${r.me ? "text-ink" : "text-ink-faint"}`}>
              {r.studentsPerTeacher}
            </span>
          </div>
        ))}
      </div>
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
