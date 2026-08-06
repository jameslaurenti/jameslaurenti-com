"use client";

import { useEffect, useRef } from "react";
import { useChartScale } from "@/lib/beverly/useChartScale";
import Link from "next/link";
import forecast from "@/data/beverly/forecast.json";

// ---- numbers from the data layer (one place to update) ----
const YEARS = forecast.summary.years; // FY26..FY30 {fy, revenue, expenditure, deficit}
const GAP_YEARS = YEARS.filter((y) => y.deficit < 0); // FY27..FY30
const LAST = YEARS[YEARS.length - 1];
const FY28 = YEARS.find((y) => y.fy === "FY28")!;
const usdM = (m: number) => `$${m.toFixed(1)}M`;

// ---- scroll reveal (respects reduced motion) ----
function useReveal() {
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const els = root.current?.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!els) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      els.forEach((el) => (el.style.opacity = "1"));
      return;
    }
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = "1";
            (e.target as HTMLElement).style.transform = "none";
            obs.unobserve(e.target);
          }
        }),
      { threshold: 0.12 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return root;
}

const revealStyle: React.CSSProperties = {
  opacity: 0,
  transform: "translateY(16px)",
  transition: "opacity .6s ease, transform .6s ease",
};

function Reveal({ children }: { children: React.ReactNode }) {
  return (
    <div data-reveal style={revealStyle}>
      {children}
    </div>
  );
}

function SectionNum({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-3 block font-display text-sm italic tracking-wide text-gold-strong">{children}</span>
  );
}

function KitchenTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 max-w-[64ch] rounded-r-md border border-l-4 border-rule border-l-accent bg-bg-card/60 px-5 py-4">
      <span className="mb-1.5 block text-[0.6875rem] font-bold uppercase tracking-wider text-accent">
        At the kitchen table
      </span>
      <p className="text-[0.9375rem] leading-relaxed text-ink-mid">{children}</p>
    </div>
  );
}

function Expandable({ summary, children }: { summary: string; children: React.ReactNode }) {
  return (
    <details className="my-6 max-w-[64ch] rounded-md border border-rule bg-bg-card/50">
      <summary className="cursor-pointer list-none px-4 py-3 text-[0.90625rem] font-semibold text-accent">
        {summary}
      </summary>
      <div className="space-y-2 px-4 pb-4 text-[0.90625rem] leading-relaxed text-ink-mid">{children}</div>
    </details>
  );
}

function ChartCard({ children }: { children: React.ReactNode }) {
  return <div className="my-8 rounded-md border border-rule bg-bg-card/50 px-6 py-6">{children}</div>;
}

// ---- Chart: the scissors (revenue vs spending) ----
function ScissorsChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  // Labels here are authored for the wide render; keep them, but never below the floor.
  const { u, fsMin } = useChartScale(svgRef, 760);
  const W = 760, H = 400, L = 95 + (u > 1 ? 34 : 0), R = 720, T = 50, B = 330;
  const revs = YEARS.map((y) => y.revenue);
  const exps = YEARS.map((y) => y.expenditure);
  const lo = Math.floor(Math.min(...revs) / 10) * 10; // 170
  const hi = Math.ceil(Math.max(...exps) / 10) * 10; // 210
  const x = (i: number) => L + (i / (YEARS.length - 1)) * (R - L);
  const y = (v: number) => B - ((v - lo) / (hi - lo)) * (B - T);
  const line = (vals: number[]) => vals.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  const area =
    exps.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ") +
    " " +
    [...revs].reverse().map((v, i) => `L${x(YEARS.length - 1 - i).toFixed(1)},${y(v).toFixed(1)}`).join(" ") +
    " Z";
  const mid = (lo + hi) / 2;
  return (
    <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Spending rises faster than income, FY2026 to FY2030" className="w-full">
      <line x1={L} y1={B} x2={R} y2={B} stroke="var(--color-rule)" />
      <line x1={L} y1={T} x2={L} y2={B} stroke="var(--color-rule)" />
      <line x1={L} y1={y(mid)} x2={R} y2={y(mid)} strokeDasharray="2 6" opacity={0.5} stroke="var(--color-rule)" />
      {[lo, mid, hi].map((v) => (
        <text key={v} x={L - 8} y={y(v) + 5} textAnchor="end" fontSize={fsMin(16)} fill="var(--color-ink-faint)">
          ${v}M
        </text>
      ))}
      <g fontSize={fsMin(19)} fontWeight={600} fill="var(--color-ink-mid)" textAnchor="middle" fontFamily="var(--font-sans)">
        {YEARS.map((yr, i) => (
          <text key={yr.fy} x={x(i)} y={B + (u > 1 ? 46 : 26)}>
            {yr.fy.replace("FY", "20")}
          </text>
        ))}
      </g>
      <path d={area} fill="var(--color-debt)" opacity={0.13} />
      <path d={line(exps)} fill="none" stroke="var(--color-debt)" strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
      <path d={line(revs)} fill="none" stroke="var(--color-accent)" strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={x(YEARS.length - 1)} cy={y(exps[exps.length - 1])} r={5} fill="var(--color-debt)" />
      <circle cx={x(YEARS.length - 1)} cy={y(revs[revs.length - 1])} r={5} fill="var(--color-accent)" />
      <text x={R - 10} y={y(exps[exps.length - 1]) - 14} textAnchor="end" fontSize={fsMin(18)} fontWeight={700} fill="var(--color-debt)" style={{ paintOrder: "stroke", stroke: "var(--color-bg)", strokeWidth: 5 }}>
        What it spends
      </text>
      <text x={R - 10} y={y(revs[revs.length - 1]) + 32} textAnchor="end" fontSize={fsMin(18)} fontWeight={700} fill="var(--color-accent)" style={{ paintOrder: "stroke", stroke: "var(--color-bg)", strokeWidth: 5 }}>
        What it collects
      </text>
    </svg>
  );
}

// ---- Chart: which costs actually outrun revenue (indexed % growth) ----
// Rates are the forecast's own per-line assumptions; debt service is its schedule.
function CostGrowthChart() {
  const svgRef = useRef<SVGSVGElement>(null);
  const { u, fsMin } = useChartScale(svgRef, 760);
  const yrs = YEARS.map((y) => y.fy); // FY26..FY30
  const n = yrs.length;
  const idx = (rate: number) => yrs.map((_, t) => ((1 + rate) ** t - 1) * 100);
  const debtAbs = [8.79, 8.97, 9.18, 9.47, 9.75]; // $M, city debt schedule FY26–FY30
  const debtIdx = debtAbs.map((v) => (v / debtAbs[0] - 1) * 100);
  const revVals = idx(0.029);
  const series = [
    { label: "Health insurance", vals: idx(0.06), color: "var(--color-debt)" },
    { label: "Pensions", vals: idx(0.045), color: "var(--color-gold-strong)" },
    { label: "Debt service", vals: debtIdx, color: "var(--color-cuts)" },
    { label: "Municipal salaries", vals: idx(0.015), color: "var(--color-accent)" },
  ];
  const W = 760, H = 360, L = 52 + (u > 1 ? 30 : 0), R = 600, T = 26, B = 300, maxY = 28;
  const x = (i: number) => L + (i / (n - 1)) * (R - L);
  const y = (v: number) => B - (v / maxY) * (B - T);
  const path = (vals: number[]) => vals.map((v, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join(" ");
  return (
    <div>
      <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Cumulative cost growth versus revenue, FY2026 to FY2030. Health insurance and pensions rise faster than revenue; salaries and debt slower." className="w-full">
        {[0, 7, 14, 21, 28].map((g) => (
          <g key={g}>
            <line x1={L} x2={R} y1={y(g)} y2={y(g)} stroke="var(--color-rule)" strokeWidth={0.5} />
            <text x={L - 6} y={y(g) + 4} textAnchor="end" fontSize={fsMin(13)} fill="var(--color-ink-faint)">+{g}%</text>
          </g>
        ))}
        {yrs.map((f, i) => (
          <text key={f} x={x(i)} y={B + (u > 1 ? 40 : 20)} textAnchor="middle" fontSize={fsMin(14)} fill="var(--color-ink-mid)">{f.replace("FY", "FY20")}</text>
        ))}
        <path d={path(revVals)} fill="none" stroke="var(--color-ink-mid)" strokeWidth={3} strokeDasharray="6 4" />
        {series.map((s) => (
          <path key={s.label} d={path(s.vals)} fill="none" stroke={s.color} strokeWidth={3} strokeLinejoin="round" strokeLinecap="round" />
        ))}
        {series.map((s) => (
          <circle key={s.label} cx={x(n - 1)} cy={y(s.vals[n - 1])} r={4} fill={s.color} />
        ))}
        <circle cx={x(n - 1)} cy={y(revVals[n - 1])} r={4} fill="var(--color-ink-mid)" />
        <text x={x(n - 1) + 8} y={y(revVals[n - 1]) + 4} fontSize={fsMin(13)} fontWeight={600} fill="var(--color-ink-mid)">Revenue</text>
      </svg>
      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-[0.8125rem] font-medium">
        <span className="inline-flex items-center gap-1.5"><i className="inline-block h-0 w-4 border-t-2 border-dashed border-ink-mid" />Revenue (near the 2.5% cap)</span>
        {series.map((s) => (
          <span key={s.label} className="inline-flex items-center gap-1.5"><i className="inline-block h-1 w-4 rounded-sm" style={{ background: s.color }} />{s.label}</span>
        ))}
      </div>
    </div>
  );
}

// ---- Chart: the growing deficit bars ----
function DeficitBars() {
  const max = Math.max(...GAP_YEARS.map((y) => -y.deficit));
  return (
    <div role="img" aria-label="The yearly shortfall grows from FY2027 to FY2030">
      {GAP_YEARS.map((y, i) => {
        const v = -y.deficit;
        const w = (v / max) * 93;
        const op = 0.5 + 0.5 * (i / (GAP_YEARS.length - 1));
        return (
          <div key={y.fy} className="my-2 grid grid-cols-[56px_1fr_60px] items-center gap-3">
            <div className="text-right text-[0.9375rem] text-ink">{y.fy.replace("FY", "20")}</div>
            <div className="h-6 overflow-hidden rounded-sm bg-black/5">
              <div className="h-full rounded-sm bg-debt" style={{ width: `${w}%`, opacity: op }} />
            </div>
            <div className="text-[0.8125rem] font-bold text-debt">{usdM(v)}</div>
          </div>
        );
      })}
    </div>
  );
}

// ---- Appendix reserves data (DLS Municipal Databank; not in the forecast data layer) ----
// Reserves = certified free cash (FY2026) + total stabilization (FY2025), each as a % of the
// operating budget, summed. The seven-town North Shore cohort, sorted high to low.
const RESERVES = [
  { town: "Beverly", pct: 19.8, me: true },
  { town: "Salem", pct: 17.8, me: false },
  { town: "Swampscott", pct: 16.7, me: false },
  { town: "Gloucester", pct: 14.3, me: false },
  { town: "Danvers", pct: 14.0, me: false },
  { town: "Peabody", pct: 6.6, me: false },
  { town: "Marblehead", pct: 6.2, me: false },
];

function ReservesBars() {
  const max = Math.max(...RESERVES.map((r) => r.pct));
  return (
    <div>
      {RESERVES.map((r) => (
        <div key={r.town} className="my-2 grid grid-cols-[96px_1fr_50px] items-center gap-2.5">
          <div className={`text-right text-[0.8125rem] leading-tight ${r.me ? "font-bold text-debt" : "text-ink"}`}>{r.town}</div>
          <div className="h-6 overflow-hidden rounded-sm bg-black/5">
            <div
              className="h-full rounded-sm"
              style={{ width: `${(r.pct / max) * 100}%`, background: r.me ? "var(--color-debt)" : "var(--color-accent)", opacity: r.me ? 1 : 0.34 }}
            />
          </div>
          <div className={`text-[0.78125rem] font-bold ${r.me ? "text-debt" : "text-ink-faint"}`}>{r.pct}%</div>
        </div>
      ))}
    </div>
  );
}

// ---- one row of the choices grid ----
function Choice({
  lever,
  q,
  chose,
  alt,
  up,
  down,
}: {
  lever: string;
  q: string;
  chose: React.ReactNode;
  alt: React.ReactNode;
  up: React.ReactNode;
  down: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-md border border-l-4 border-rule border-l-gold bg-bg-card/50">
      <div className="grid sm:grid-cols-[1.05fr_1fr_1fr]">
        <div className="border-b border-rule bg-black/[0.03] p-4 font-display text-[1.125rem] sm:border-b-0 sm:border-r">
          {lever}
          <p className="mt-1.5 font-sans text-[0.875rem] font-normal text-ink-mid">{q}</p>
        </div>
        <div className="border-b border-rule p-4 sm:border-b-0 sm:border-r">
          <span className="mb-1.5 block text-[0.6875rem] font-bold uppercase tracking-wider text-accent">What the city does</span>
          <p className="text-[0.90625rem] leading-snug text-ink">{chose}</p>
        </div>
        <div className="p-4">
          <span className="mb-1.5 block text-[0.6875rem] font-bold uppercase tracking-wider text-gold-strong">Another option</span>
          <p className="text-[0.90625rem] leading-snug text-ink">{alt}</p>
        </div>
      </div>
      <div className="border-t border-dashed border-debt/60 bg-debt/[0.05] px-4 py-3.5">
        <span className="mb-2 block text-[0.6875rem] font-bold uppercase tracking-wider text-debt">The trade-off</span>
        <p className="mb-2 text-[0.90625rem] leading-snug text-ink">
          <span className="mr-1.5 rounded-sm bg-accent/15 px-1.5 py-0.5 text-[0.6875rem] font-bold uppercase tracking-wide text-accent">Upside</span>
          {up}
        </p>
        <p className="text-[0.90625rem] leading-snug text-ink">
          <span className="mr-1.5 rounded-sm bg-debt/15 px-1.5 py-0.5 text-[0.6875rem] font-bold uppercase tracking-wide text-debt">Downside</span>
          {down}
        </p>
      </div>
    </div>
  );
}

const A = (props: { href: string; children: React.ReactNode; ext?: boolean }) => (
  <Link
    href={props.href}
    className="rlink"
    {...(props.ext ? { target: "_blank", rel: "noopener" } : {})}
  >
    {props.children}
  </Link>
);

export default function BudgetExplainer() {
  const root = useReveal();
  return (
    <div ref={root} className="bg-bg text-ink">
      <div className="mx-auto max-w-3xl px-6 pb-24">
        {/* hero */}
        <header className="border-b border-rule py-14 sm:py-20">
          <span className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-debt">
            Beverly, Massachusetts · How the money works
          </span>
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            A state law caps how fast Beverly can raise money. Its costs rise faster.
          </h1>
          <p className="mt-5 max-w-[60ch] text-xl leading-snug text-ink-mid sm:text-[1.5625rem]">
            Every fight over City Hall, trash fees, or teaching jobs sits on top of the same problem. The
            clearest way to see it is to picture the whole city as one household, so that&apos;s the thread
            running through this page, in a short box at each step.{" "}
            <b className="font-bold text-ink">Real Beverly numbers, plain language, no finance background needed.</b>
          </p>
          <p className="mt-8 text-[0.8125rem] leading-relaxed text-ink-faint">
            A nonpartisan explainer. Figures from the city&apos;s own budget documents, with sources at the
            bottom.
          </p>
          <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-faint">
            This explains how Beverly&apos;s budget works structurally, the machinery that holds in any year.
            For how one year&apos;s gap actually got closed, see <A href="/work/beverly/fy27-budget">The FY2027 budget</A>.
            To see how Beverly compares to every town in the state, there&apos;s <A href="/work/beverly/property-tax">the MA property tax explorer</A>.
          </p>

          {/* translation key */}
          <div className="mt-8 rounded-lg border border-rule bg-bg-card/60 px-6 py-6 shadow-sm">
            {/* h2, not h3: this card sits directly under the h1, before any section heading,
                so an h3 here skips a level for anyone navigating by headings. */}
            <h2 className="font-display text-lg font-semibold">Picture the city as a household</h2>
            <ul className="divide-y divide-rule">
              {[
                ["The capped raise", <>Property taxes, the city&apos;s main income, can rise only about 2.5% a year. <span className="text-ink-faint">A state law called Proposition 2½.</span></>],
                ["The bills that outrun it", <>Health insurance, pensions, the schools, and special education, climbing faster than the raise.</>],
                ["The mortgage", <>Borrowing for big buildings, paid back slowly over decades. <span className="text-ink-faint">Officials call these capital projects.</span></>],
                ["The rainy-day jar", <>The city&apos;s savings cushion. <span className="text-ink-faint">Officials call it reserves.</span></>],
                ["The one-time yard sale", <>Money you can only spend once, gone after a single year.</>],
                ["The vote at the table", <>Asking residents to approve higher taxes for good. <span className="text-ink-faint">Officials call it an override.</span></>],
              ].map(([h, m], i) => (
                <li key={i} className="grid gap-x-5 gap-y-1 py-2.5 sm:grid-cols-[210px_1fr] sm:items-baseline">
                  <span className="font-display text-[1rem] font-semibold text-accent">{h}</span>
                  <span className="text-[0.9375rem] text-ink">{m}</span>
                </li>
              ))}
            </ul>
          </div>
        </header>

        {/* 01 */}
        <section className="border-b border-rule py-14">
          <Reveal>
            <SectionNum>01 · The scissors</SectionNum>
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              The city can&apos;t raise money as fast as its bills grow.
            </h2>
            <p className="mt-3 max-w-[63ch] leading-relaxed">
              Most of the city&apos;s income comes from property taxes, and the cap lets that income grow only
              about 2.5% a year, plus a little from new construction. The city&apos;s costs don&apos;t stop at
              2.5%. Health insurance, pensions, and the school budget climb faster, roughly 4% to 9% a year. So
              the bills pull ahead of the income, a little more every year.
            </p>
            <KitchenTable>
              Your boss can give you a 2.5% raise. But rent, groceries, and insurance went up 6%. You&apos;re
              not overspending. The math just stops adding up, and it slips a little further each year.
            </KitchenTable>
            <p className="max-w-[63ch] leading-relaxed">
              Picture two lines. The top one is what the city has to spend. The bottom one is what it&apos;s
              allowed to collect. They start together and pull apart, like a pair of scissors opening. The
              space between them is the shortfall, and it grows on its own before anyone makes a single
              decision.
            </p>
            <ChartCard>
              <ScissorsChart />
              <div className="mt-2 flex flex-wrap gap-5 text-[0.875rem] font-medium">
                <span className="inline-flex items-center gap-2"><i className="inline-block h-2.5 w-4 rounded-sm bg-accent" />Money coming in</span>
                <span className="inline-flex items-center gap-2"><i className="inline-block h-2.5 w-4 rounded-sm bg-debt" />Money going out</span>
                <span className="inline-flex items-center gap-2"><i className="inline-block h-2.5 w-4 rounded-sm bg-debt/25" />The shortfall</span>
              </div>
              <p className="mt-3.5 max-w-[64ch] text-[0.90625rem] text-ink-mid">
                The exact dollar figures matter less than the shape: the spending line pulls away from the
                income line, and the gap widens every year. Both lines start equal in {YEARS[0].fy.replace("FY", "FY20")} because the
                city is required by law to pass a balanced budget.
              </p>
              <p className="mt-3 border-t border-rule pt-2.5 text-[0.78125rem] italic text-ink-faint">
                Source: City of Beverly,{" "}
                <A href="https://beverlyma.gov/DocumentCenter/View/6958/Financial-Forecast-Report-FY2026-2030" ext>
                  Financial Forecast FY2026–2030
                </A>{" "}
                (December 2025).
              </p>
            </ChartCard>
            <Expandable summary="Which costs are actually rising?">
              <p>
                Not every cost grows at the same speed, and that is the real story. The chart below indexes each
                to its {YEARS[0].fy.replace("FY", "FY20")} level, so every line shows how much it has grown since. Any line above the dashed
                revenue line is a cost outrunning the money coming in.
              </p>
              <CostGrowthChart />
              <p className="mt-3">
                Health insurance and pensions are the fast ones, climbing well past the 2.5% cap. The school
                budget, the single largest cost, grows around 5% a year (shown in the scissors chart above, not
                here). Debt payments and the city&apos;s own municipal salaries actually grow slower than revenue.
                One caveat: most of the payroll is in the schools, inside that line, and school salaries climb
                faster than the municipal ones shown here. These are the
                forecast&apos;s own annual assumptions: health insurance about 6% a year, though the {GAP_YEARS[0].fy.replace("FY", "FY20")} actual
                came in near 9 to 10%; pensions 4.5%; salaries 1.5%; revenue about 2.9%. By {LAST.fy.replace("FY", "FY20")}, spending is
                projected near {usdM(LAST.expenditure)} against about {usdM(LAST.revenue)} in revenue, a gap of roughly {usdM(-LAST.deficit)}.
              </p>
            </Expandable>
          </Reveal>
        </section>

        {/* 02 */}
        <section className="border-b border-rule py-14">
          <Reveal>
            <SectionNum>02 · The gap was no surprise</SectionNum>
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              The city saw this coming, and it keeps getting worse.
            </h2>
            <p className="mt-3 max-w-[63ch] leading-relaxed">
              This was not sprung on anyone. The city&apos;s own financial forecasts have shown this gap for
              years, and the latest, from December 2025, shows it steepening. Left alone, the yearly shortfall
              grows from about {usdM(-GAP_YEARS[0].deficit)} in {GAP_YEARS[0].fy.replace("FY", "FY20")} to nearly {usdM(-LAST.deficit)} by{" "}
              {LAST.fy.replace("FY", "FY20")}. Next year, {FY28.fy.replace("FY", "FY20")}, the gap nearly doubles to {usdM(-FY28.deficit)}, which is why the
              harder decisions are already being weighed.
            </p>
            <KitchenTable>
              You ran the numbers and saw this tight stretch coming. You were right. And next year looks
              tighter, and the one after that tighter still, unless something changes.
            </KitchenTable>
            <ChartCard>
              <DeficitBars />
              <p className="mt-3.5 max-w-[64ch] text-[0.90625rem] text-ink-mid">
                <b className="text-ink">How big the yearly shortfall would get if the city did nothing.</b>{" "}It
                can&apos;t actually do nothing, since it has to balance the budget by law, so read this as a
                warning light, not a prediction. Each year it has to close that year&apos;s gap somehow.
              </p>
              <p className="mt-3 border-t border-rule pt-2.5 text-[0.78125rem] italic text-ink-faint">
                Source: City of Beverly,{" "}
                <A href="https://beverlyma.gov/DocumentCenter/View/6958/Financial-Forecast-Report-FY2026-2030" ext>
                  Financial Forecast FY2026–2030
                </A>{" "}
                (December 2025).
              </p>
            </ChartCard>
            <Expandable summary="How do we know it was foreseen?">
              <p>
                The city&apos;s Financial Forecast Committee has projected this gap in report after report. Its
                December 2025 forecast puts the {GAP_YEARS[0].fy.replace("FY", "FY20")} shortfall at about {usdM(-GAP_YEARS[0].deficit)}, then
                widening to roughly {usdM(-GAP_YEARS[1].deficit)}, {usdM(-GAP_YEARS[2].deficit)}, and {usdM(-GAP_YEARS[3].deficit)} through {LAST.fy.replace("FY", "FY20")} if
                nothing changes. The committee calls this stretch qualitatively different from prior years,
                because the one-time fixes it used before, a roads shift, unused levy capacity, a
                prescription-cost restructuring, no longer exist (see the next section).
              </p>
            </Expandable>
          </Reveal>
        </section>

        {/* 03 */}
        <section className="border-b border-rule py-14">
          <Reveal>
            <SectionNum>03 · The one-time fixes are used up</SectionNum>
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              For years, the city patched the gap with money it could only spend once.
            </h2>
            <p className="mt-3 max-w-[63ch] leading-relaxed">
              Beverly has run shortfalls on paper for a long time, and it kept closing them with one-time
              money. A big slug of federal pandemic aid. Road repairs shifted out of the day-to-day budget.
              Unused tax room. Equipment it chose not to buy. Each worked exactly once. Now they&apos;re spent,
              and what&apos;s left are the hard tools: <b>raise fees, or cut services.</b>
            </p>
            <KitchenTable>
              One year you sold the old car; another you skipped vacation and raided the holiday jar. Those got
              you through, but you can&apos;t sell the same car twice. Eventually you&apos;re down to the hard
              choices: a side job, or cutting things you&apos;d rather keep.
            </KitchenTable>
            <div className="my-7 grid gap-3.5 sm:grid-cols-2">
              {[
                ["$12.6M", "Federal pandemic aid, spent and won't repeat"],
                ["$2.7M", "Road repairs moved out of the day-to-day budget"],
                ["$1.4M", "Unused tax room, now drawn down"],
                ["$300K", "Equipment purchases the city skipped"],
              ].map(([amt, what]) => (
                <div key={amt} className="relative rounded-md border border-rule bg-bg-card/50 px-4 py-4">
                  <span className="absolute right-2.5 top-2.5 rotate-6 rounded border border-debt px-1.5 py-0.5 text-[0.6875rem] font-bold uppercase tracking-wider text-debt opacity-80">
                    Gone
                  </span>
                  <div className="font-display text-2xl font-extrabold">{amt}</div>
                  <div className="mt-1.5 text-[0.84375rem] text-ink-mid">{what}</div>
                </div>
              ))}
            </div>
            <p className="max-w-[64ch] text-[0.90625rem] text-ink-mid">
              The problem was never any single one of these moves. It&apos;s that none of them come back the
              next year. <span className="text-ink-faint">In budget language, these are &quot;one-time&quot; sources, as opposed to steady, recurring money.</span>
            </p>
            <p className="mt-3 max-w-[64ch] text-[0.90625rem] text-ink-mid">
              One honest wrinkle: the city does still finish most years with free cash, often around $10 million.
              So the money hasn&apos;t vanished. But free cash is one-time money too, and using it to cover
              recurring salaries would only strand those jobs the first year it dips. What the city does with that
              surplus, routing it into reserves and buildings rather than services, is less a dead end than a
              choice. That choice is the next section.
            </p>
          </Reveal>
        </section>

        {/* 04 */}
        <section className="border-b border-rule py-14">
          <Reveal>
            <SectionNum>04 · The choices, and what each one costs</SectionNum>
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              The city can&apos;t make the squeeze disappear. It can only decide how to carry it.
            </h2>
            <p className="mt-3 max-w-[63ch] leading-relaxed">
              The shortfall is mostly outside the city&apos;s control. But how it copes is a set of standing
              choices, and each one helps in one way and costs in another. None is free. Here are the four big
              ones in plain terms, with the upside and the downside of each. Reasonable neighbors land in
              different places on all of them.
            </p>
            <KitchenTable>
              Every money decision a household makes is a trade-off: pay down the debt or take the trip, save
              more or spend now. There&apos;s rarely a free option, only different costs landing on different
              people. The city&apos;s choices work the same way.
            </KitchenTable>
            <div className="mt-7 flex flex-col gap-4">
              <Choice
                lever="Guessing next year's income"
                q="Plan high, or plan low?"
                chose={<>Guesses <b>low</b>{" "}on purpose. Money that comes in above the guess becomes savings.</>}
                alt={<>Guess the income <b>honestly</b>, leaving more room to fund services now.</>}
                up={<>Builds savings and keeps borrowing cheap. It also guards against guessing too high and running out of money partway through the year, which would force cuts mid-year, in the middle of a school year.</>}
                down={<>It makes the shortfall look bigger on paper every year, and that bigger number is what gets used to justify cuts.</>}
              />
              <Choice
                lever="How much to keep in savings"
                q="A big rainy-day jar, or a small one?"
                chose={<>Keeps a <b>large</b>{" "}cushion, near 20% of its budget, roughly two and a half months of spending, the highest of its North Shore cohort. About two-thirds of that is the stabilization fund, a formal savings account; the rest is free cash, last year&apos;s leftover.</>}
                alt={<>Hold a smaller cushion, closer to what comparable towns keep, and spend the difference on services.</>}
                up={<>A big cushion rides out a bad year and keeps borrowing cheap.</>}
                down={<>Money in the jar isn&apos;t paying for services today. And drain it to cover everyday bills, and it&apos;s gone, with the same gap waiting next year. <span className="text-ink-faint">(How Beverly&apos;s cushion compares is in the <A href="#reserves">appendix</A>.)</span></>}
              />
              <Choice
                lever="How to pay for big buildings"
                q="Borrow, pay cash, or wait?"
                chose={<><b>Borrows</b>{" "}for big projects like the City Hall renovation, repaid slowly over many years.</>}
                alt={<>Pay cash (which drains the savings jar), or delay the project, though a building left to decay only costs more to fix later.</>}
                up={<>Spreads the cost over the decades people use the building, instead of draining today&apos;s savings.</>}
                down={<>The city owes the loan payments for years. And the key point: that borrowed money legally can&apos;t be turned into salaries. It&apos;s a separate pot, like a mortgage you can&apos;t spend on groceries.</>}
              />
              <Choice
                lever="How to close the gap"
                q="Fees, cuts, a tax vote, or more growth?"
                chose={<>Raises flat <b>fees</b>{" "}like the trash bill and cuts services, to avoid asking voters for higher taxes. It also grows the tax base, though it has eased off lately, lowering downtown building heights in 2023 and buying a Cabot Street parcel to keep it a parking lot.</>}
                alt={<>Ask voters to approve a permanent tax increase (an override), chase new growth harder, pursue payments from large tax-exempt institutions, or change how much of the surplus goes to reserves rather than services.</>}
                up={<>A fee is easier than a town-wide vote and avoids raising everyone&apos;s taxes.</>}
                down={<>A flat fee costs a struggling household the same as a wealthy one, and it doesn&apos;t keep up with rising costs, so the gap returns next year. An override could fix it lastingly, but it raises everyone&apos;s taxes and the vote can fail.</>}
              />
            </div>
            <div className="mt-8 rounded-r-md border-l-4 border-gold bg-bg-card/50 px-6 py-5 font-display text-xl leading-snug sm:text-[1.4375rem]">
              <b className="font-extrabold">The pattern:</b>{" "}on every row, the choice that protects the
              city&apos;s long-term strength also pushes more of the near-term pain onto current services and
              onto flat fees. That is the real decision in front of the city, and it comes down to values and
              risk, not arithmetic.
            </div>
            <p className="mt-6">
              Think the money&apos;s just sitting there? <A href="/work/beverly/budget-challenge">Try finding it yourself.</A>
            </p>
          </Reveal>
        </section>

        {/* 05 */}
        <section className="border-b border-rule py-14">
          <Reveal>
            <SectionNum>05 · The argument worth having</SectionNum>
            <div className="rounded-md bg-ink px-7 py-8 text-bg">
              <p className="font-display text-2xl font-extrabold leading-tight sm:text-4xl text-white">
                The pressure is real, it&apos;s getting worse, and the easy money is gone.
              </p>
              <p className="mt-4 max-w-[64ch] leading-relaxed text-bg/90">
                That&apos;s why the loudest fight, &quot;they&apos;re renovating City Hall while cutting
                teachers,&quot; misses the mark. Those are two separate pots. The building money is borrowed and
                repaid over decades; by law it can&apos;t become next year&apos;s salaries, and spending
                borrowed money on everyday bills would only blow a bigger hole later.
              </p>
              <p className="mt-5 font-bold text-white">The disagreements worth having are these:</p>
              <ul className="my-4 max-w-[66ch] divide-y divide-white/15">
                {[
                  ["How much risk to carry.", "Keep a big safety net and cut now, or spend more on services and accept the danger of a mid-year shortfall?"],
                  ["How much to save, and in what form.", "Is the rainy-day jar bigger than it needs to be, and should more of it be easy to reach instead of locked away?"],
                  ["Band-aid or real fix.", "Keep raising flat fees that don't keep up, or ask voters for a permanent tax change that fixes the gap but costs everyone?"],
                  ["Spend less, or bring in more.", "Where can the city honestly cut costs, like health care or sharing services with nearby towns, and should it grow what it collects by welcoming new development?"],
                  ["Who carries the weight.", "Renters, homeowners, seniors, families, and big tax-exempt institutions don't feel these choices the same way. Who should?"],
                ].map(([b, t]) => (
                  <li key={b} className="py-3 text-[1rem] leading-snug text-bg/90">
                    <b className="font-display text-[1.0625rem] text-white">{b}</b>{" "}{t}
                  </li>
                ))}
              </ul>
              <p className="max-w-[64ch] leading-relaxed text-bg/90">
                Those are real, fair disagreements about risk, fairness, and priorities, and they&apos;re worth
                arguing loudly. Blaming each other over two unrelated bills just runs out the clock while the
                gap keeps widening.
              </p>
            </div>
          </Reveal>
        </section>

        {/* 06 */}
        <section className="border-b border-rule py-14">
          <Reveal>
            <SectionNum>06 · The conversation is already happening</SectionNum>
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">This isn&apos;t a lone voice in the dark.</h2>
            <p className="mt-3 max-w-[63ch] leading-relaxed">
              Beverly is a town worth caring about, and this is a real problem. We&apos;re already feeling it: a
              trash bill leaping from $100 toward $300 or more, jobs cut across city departments, even police
              and fire posts left unfilled. Those costs land on real households right now.
            </p>
            <p className="max-w-[63ch] leading-relaxed">
              But most of the public energy goes to the symptoms, the size of the trash fee and the look of the
              City Hall project, and to deciding who to blame. The slow squeeze underneath barely comes up.
              Some people are digging into the real causes, on the City Council and in letters from residents,
              but it&apos;s scattered. This page is here to hand everyone the same map.
            </p>
            <p className="mt-5 font-bold">Where it&apos;s playing out, if you want to follow it or speak up:</p>
            <ul className="my-4 max-w-[70ch] divide-y divide-rule">
              {[
                [<>The Beverly Beat.</>, <>A local newsletter that covers the budget meeting by meeting. <A href="https://thebeverlybeat.substack.com" ext>Visit</A></>],
                [<>Open Beverly.</>, <>A fellow resident&apos;s independent data portal on the same budget, with a meeting tracker, a capital-plan explorer, and a tool to look up any street&apos;s pavement condition. <A href="https://openbeverly.org" ext>Visit</A></>],
                [<>City Council meetings.</>, <>Anyone can speak for a few minutes, at City Hall (191 Cabot St.); the schedule lives in the city&apos;s <A href="https://www.beverlyma.gov/AgendaCenter" ext>Agenda Center</A>. Can&apos;t attend? <A href="https://bevcam.org" ext>BevCam</A> streams and archives.</>],
                [<>Patch (Beverly).</>, <>Local news, plus opinion pieces by residents. <A href="https://patch.com/massachusetts/beverly" ext>Visit</A></>],
                [<>Local Facebook groups.</>, <>Where the day-to-day reaction lives, for better and worse.</>],
              ].map(([b, t], i) => (
                <li key={i} className="py-3 text-[0.96875rem] leading-relaxed">
                  <b className="font-display font-semibold text-ink">{b}</b>{" "}<span className="text-ink-mid">{t}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </section>

        {/* appendix */}
        <section id="reserves" className="border-t-2 border-double border-rule py-14">
          <Reveal>
            <SectionNum>Appendix · A fact-check</SectionNum>
            <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">Is the city sitting on a pile of cash?</h2>
            <p className="mt-3 max-w-[63ch] leading-relaxed">
              A common charge is that Beverly hoards money while pleading poverty. So let&apos;s check it.
            </p>
            <KitchenTable>
              The question is just: is this family&apos;s rainy-day jar bigger than the neighbors&apos;? The fair
              way to compare is to measure each household&apos;s savings against its own spending, not in raw
              dollars.
            </KitchenTable>
            <p className="max-w-[63ch] leading-relaxed">
              Here&apos;s Beverly&apos;s savings cushion next to its six North Shore neighbors, measured as a
              share of each town&apos;s yearly budget.
            </p>
            <ChartCard>
              <ReservesBars />
              <p className="mt-3 pl-[106px] text-[0.78125rem] italic text-ink-faint">Cohort median ≈ 14%.  Beverly: 19.8%, the highest of the seven.</p>
              <p className="mt-3.5 max-w-[64ch] text-[0.90625rem] text-ink-mid">
                <b className="text-ink">Reserves as a share of the yearly budget: free cash plus stabilization, most recent state figures.</b>{" "}
                So the charge has something to it. Of the seven North Shore towns, Beverly holds the largest
                cushion, near 20% of its budget, roughly two and a half months of spending. Two different pots
                sit inside that figure: about 14 points of it is the stabilization fund, the formal savings
                account the city votes money into, and about 6 points is certified free cash, the surplus left
                when the books close. That is high but not
                reckless by rating-agency standards; what stands out is that Beverly sits at the top of its cohort
                on reserves while running services near the bottom. Two things keep it honest. Beverly&apos;s
                cushion is also the most flexible of the group, mostly free cash and general savings, where much
                of a town like Gloucester&apos;s is earmarked for specific purposes. And the real story is the
                habit, not the balance: year after year Beverly routes its surplus into reserves, debt payoff, and
                buildings rather than services, and keeps the jar topped up even as the deficit grows. That pattern
                of choices is what the companion piece on the city&apos;s fiscal identity examines in full.
              </p>
              <p className="mt-3 border-t border-rule pt-2.5 text-[0.78125rem] italic text-ink-faint">
                Source: Massachusetts Division of Local Services{" "}
                <A href="https://dls-gw.dor.state.ma.us/reports/rdPage.aspx?rdReport=Dashboard.Cat_1_Reports.CertifiedFreeCashBudget351" ext>Municipal Databank</A>:
                certified free cash (FY2026) plus total stabilization fund balances (FY2025, the most recent reported),
                each measured against the operating budget. Reserves here are the sum of the two.
              </p>
            </ChartCard>
          </Reveal>
        </section>

        <footer className="py-10 text-[0.84375rem] text-ink-faint">
          <h3 className="font-display text-lg text-ink">Sources &amp; notes</h3>
          <p className="mt-2 max-w-[72ch]">
            The income-vs-spending lines, the growing shortfall, the per-line cost-growth rates, and the
            one-time fixes are from the City of Beverly{" "}
            <A href="https://beverlyma.gov/DocumentCenter/View/6958/Financial-Forecast-Report-FY2026-2030" ext>Financial Forecast FY2026–2030</A>{" "}
            (December 2025) and its prior editions. Line-item spending and the borrowing for big projects are
            from the city&apos;s{" "}
            <A href="https://www.beverlyma.gov/309/Fiscal-Budgets" ext>operating budgets</A>. The savings
            comparison uses the state&apos;s{" "}
            <A href="https://www.mass.gov/info-details/municipal-finance-trend-dashboard-reports" ext>Municipal Finance Trend Dashboard</A>, which reports every community&apos;s reserves the same way. There
            is no single official &quot;correct&quot; reserve level, and statewide reserves have been
            historically high since the pandemic.
          </p>
          <p className="mt-3.5 max-w-[72ch]">
            Dollar figures are rounded. The &quot;shortfall&quot; figures show the gap before the city closes
            it, which by law it must. This page explains the structure; it does not argue a side.
          </p>
        </footer>
      </div>
    </div>
  );
}
