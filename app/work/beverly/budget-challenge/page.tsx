"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import forecast from "@/data/beverly/forecast.json";

/* ---- data layer ---- */
const Y = forecast.summary.years;
const gapOf = (fy: string) => -(Y.find((y) => y.fy === fy)?.deficit ?? 0); // $M
const TRAJ = (["FY28", "FY29", "FY30"] as const).map((f) => gapOf(f)); // 7.11, 10.01, 13.68
const FREE_CASH = 10.5; // $M, FY26 certified free cash (forecast.json reserves)
const POS = 95000;

const fmt = (n: number) => "$" + Math.round(n).toLocaleString("en-US");
const fmtM = (n: number) => "$" + (n / 1e6).toFixed(Math.abs(n) < 1e7 ? 2 : 1) + "M";
const fmtC = (n: number) => (Math.abs(n) >= 1e6 ? fmtM(n) : "$" + Math.round(n / 1000) + "K"); // compact: K under $1M
const jobsOf = (cut: number) => Math.max(1, Math.round(cut / POS));

/* ---- trash lever: sets the operating gap the mayor's cuts must cover ---- */
type TrashKey = "A" | "C" | "B";
const TRASH: Record<TrashKey, { fee: string; household: string; gap: number; gf: string; note: string; adopted?: boolean }> = {
  A: { fee: "$100 flat", household: "no change", gap: 4200000, gf: "$3.80M", note: "Keep the old flat fee. Several councillors argued for this, or something near it." },
  C: { fee: "$300 standard bin", household: "about +$200 / year", gap: 1810000, gf: "$1.40M", note: "The schedule the Council adopted, 7-2. More than before, less than the mayor wanted.", adopted: true },
  B: { fee: "$425 standard bin", household: "about +$325 / year", gap: 400000, gf: "about $0", note: "The mayor's original, higher proposal. It would have nearly erased the gap, and cost households the most." },
};

/* ---- the mayor's cuts, which BALANCE the budget (sum $1.81M = the gap at $300) ---- */
type Cut = { id: string; nm: string; amt: number; jobs: number; note: string };
const MAYOR_CUTS: Cut[] = [
  { id: "capital", nm: "Capital projects fund, zeroed out", amt: 525000, jobs: 0, note: "Deferred equipment and repairs, not people. The needs don't vanish; they wait, often at higher cost." },
  { id: "reserve", nm: "Emergency reserve, reduced", amt: 186000, jobs: 0, note: "A thinner mid-year cushion for storms, settlements, and surprises." },
  { id: "bus", nm: "City bus (CATA shuttle), discontinued", amt: 185000, jobs: 0, note: "A contract, not city staff, but riders without cars lost the route." },
  { id: "libcoa", nm: "Library, Council on Aging, health, veterans", amt: 220000, jobs: 2, note: "Reduced hours at the Beverly Farms branch." },
  // 2.5 is the reported figure. The counter carries it rather than rounding to 3 and
  // contradicting the label directly above it.
  { id: "mayor", nm: "Mayor's office, 2.5 positions", amt: 155000, jobs: 2.5, note: "Plus two nonprofit contracts ended. Sustainability role now covered by a private donor for two years." },
  { id: "admin", nm: "Inspections, HR, solicitor, clerk", amt: 152000, jobs: 2, note: "Attrition and eliminated positions across administration." },
  { id: "planning", nm: "Planning position + consulting", amt: 22000, jobs: 1, note: "Less capacity for permit review, zoning, and grant writing." },
  { id: "tighten", nm: "Consulting, travel, supplies, workers-comp reserve", amt: 365000, jobs: 0, note: "Discretionary spending squeezed across every department." },
];
const MAYOR_TOTAL = MAYOR_CUTS.reduce((s, c) => s + c.amt, 0); // 1.81M

/* ---- the Council's June-23 additions, ON TOP of an already-balanced budget → free cash ---- */
const COUNCIL_CUTS: (Cut & { vote: string })[] = [
  { id: "racial", nm: "Racial Justice position, eliminated", amt: 62620, jobs: 1, vote: "5-4", note: "A staff position cut by amendment on a narrow vote." },
  { id: "analyst", nm: "Budget analyst, reduced further", amt: 20000, jobs: 0, vote: "9-0", note: "A further per-diem reduction on top of the mayor's." },
  { id: "mail", nm: "Mail messenger position, eliminated", amt: 7000, jobs: 1, vote: "5-4", note: "A small position zeroed out." },
  { id: "mayorexp", nm: "Mayor's office expenses, trimmed", amt: 3500, jobs: 0, vote: "9-0", note: "A line-item expense reduction." },
];
const COUNCIL_TOTAL = COUNCIL_CUTS.reduce((s, c) => s + c.amt, 0); // 93,120

/* ---- revenue possibilities, none the Council's to simply decide ---- */
type Rev = { id: string; nm: React.ReactNode; amt: number; tag: "estimated"; cond: React.ReactNode; why: string };
const REV: Rev[] = [
  {
    id: "gic",
    nm: (
      <>
        Join the state{" "}
        <a href="https://www.mass.gov/orgs/group-insurance-commission" target="_blank" rel="noopener" className="rlink">Group Insurance Commission</a>
      </>
    ),
    amt: 2000000,
    tag: "estimated",
    cond: "The GIC is a state agency that buys health insurance in bulk for state workers and many cities and towns. Beverly self-insures now; joining could save real money, but the unions must agree to the switch.",
    why: "Beverly's Financial Forecast Committee has flagged that joining the GIC could save \"several million\" a year. $2M is a deliberately conservative floor; the real number depends on plan design, enrollment, and what the unions accept.",
  },
  {
    id: "pilot",
    nm: <>Larger payments from Endicott &amp; Beverly Hospital</>,
    amt: 500000,
    tag: "estimated",
    cond: "Voluntary. These tax-exempt institutions pay about $250K a year combined now; a bigger payment in lieu of taxes requires them to agree to it.",
    why: "Beverly collects roughly $250K in voluntary payments today. Cities with formal PILOT programs collect several times that from their large institutions, so $500K is a modest step up, closer to a doubling than a ceiling.",
  },
];
const OVERRIDE_MAX = 5000000;
const LEVY = forecast.revenueDetailFy27.lines.taxRevenueNet; // FY27 net property-tax revenue
const TAX_SHARE = Math.round((LEVY / forecast.revenueDetailFy27.lines.totalRevenue) * 100); // ~78% of the budget

/* ---- development / new growth (DLS 11-yr series + FY27 budget) ---- */
const DEV = { actual: 1950000, planned: 1250000, low: 843000, mean: 1590000, high: 2190000, min: 800000, max: 2250000 };

// Schools is the FY2027 appropriation, read from the forecast so the two cannot drift.
// The other three are FY2026 department budgets; the city publishes no FY2027 breakdown at
// that level. Disclosed in the footer.
const DEEPER = [
  { id: "schools", nm: "Beverly Public Schools", amt: forecast.expenditureDetailFy27.schoolFunding },
  { id: "police", nm: "Police", amt: 10720098 },
  { id: "fire", nm: "Fire", amt: 8395132 },
  { id: "dpw", nm: "Public Works", amt: 9071553 },
];

export default function BudgetChallenge() {
  const [trash, setTrash] = useState<TrashKey>("C");
  const [mayorKept, setMayorKept] = useState<Record<string, boolean>>(() => Object.fromEntries(MAYOR_CUTS.map((c) => [c.id, true])));
  const [councilKept, setCouncilKept] = useState<Record<string, boolean>>(() => Object.fromEntries(COUNCIL_CUTS.map((c) => [c.id, true])));
  const [rev, setRev] = useState<Record<string, boolean>>(() => Object.fromEntries(REV.map((r) => [r.id, false])));
  const [override, setOverride] = useState(0);
  const [overrideOn, setOverrideOn] = useState(false);
  const [devOn, setDevOn] = useState(false);
  const [dev, setDev] = useState(DEV.actual);
  const [deeper, setDeeper] = useState<Record<string, number>>({ schools: 0, police: 0, fire: 0, dpw: 0 });

  const { gap, operating, freeCash, jobs } = useMemo(() => {
    const gap = TRASH[trash].gap;
    let covered = 0, jobs = 0;
    MAYOR_CUTS.forEach((c) => { if (mayorKept[c.id]) { covered += c.amt; jobs += c.jobs; } });
    REV.forEach((r) => { if (rev[r.id]) covered += r.amt; });
    if (overrideOn) covered += override;
    if (devOn) covered += dev - DEV.actual; // dev above/below the $1.95M the budget assumed
    DEEPER.forEach((d) => { const cut = d.amt * ((deeper[d.id] ?? 0) / 100); covered += cut; if (cut > 0) jobs += jobsOf(cut); });
    const operating = covered - gap; // >=0 means balanced (surplus rolls to free cash)
    let freeCash = 0;
    COUNCIL_CUTS.forEach((c) => { if (councilKept[c.id]) { freeCash += c.amt; jobs += c.jobs; } });
    freeCash += Math.max(0, operating);
    return { gap, operating, freeCash, jobs };
  }, [trash, mayorKept, councilKept, rev, override, overrideOn, devOn, dev, deeper]);

  const short = operating < -25000;
  const ratio = Math.min(100, gap > 0 ? ((gap + Math.min(0, operating)) / gap) * 100 : 100);

  return (
    <div className="bg-bg text-ink">
      <div className="mx-auto max-w-3xl px-6 pb-36">
        {/* hero */}
        <header className="border-b border-rule py-12 sm:py-16">
          <span className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-debt">Beverly, Massachusetts · Try it yourself</span>
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-6xl">
            &quot;The money is there. They just need to find it.&quot;
          </h1>
          <p className="mt-5 max-w-[62ch] text-[1.1875rem] leading-snug text-ink-mid">
            It&apos;s the most common thing people say about the city budget. So here is Beverly&apos;s actual FY2027 budget, balanced the
            way the city balanced it. <b className="font-bold text-ink">Now you&apos;re in the chair.</b>{" "}Change the trash fee, put back
            what they cut, reach for money that isn&apos;t the Council&apos;s to simply take. Every lever is real, and so is its catch.
            Watch the balance at the bottom of your screen.
          </p>
        </header>

        {/* free cash */}
        <section className="border-b border-rule py-8">
          <div className="rounded-md border border-l-4 border-rule border-l-gold bg-bg-card/50 px-5 py-4">
            <div className="text-[0.6875rem] font-bold uppercase tracking-widest text-gold-strong">Free cash: the money that&apos;s there, and can&apos;t help</div>
            <p className="mt-1.5 max-w-[68ch] text-[0.90625rem] leading-relaxed text-ink-mid">
              Beverly closed its FY2026 books with about <b className="text-ink">{fmtM(FREE_CASH * 1e6)}</b>{" "}in certified free cash. Free
              cash is last year&apos;s leftover, the money the city took in above what it spent, certified by the state after the books
              close. It&apos;s the pool available to appropriate the next year, which is why people say the money is there. But it&apos;s
              <b className="text-ink"> one-time money</b>: state rules bar it from funding recurring costs like salaries, because the job
              vanishes the year the surplus dips. And it&apos;s already spoken for, routed to roads, the stabilization fund, the
              retiree-health trust, and capital projects. It sits outside the operating budget below. When your choices over-balance the
              budget, the extra lands here, in free cash, not in services.
            </p>
          </div>
        </section>

        {/* LEVER 1: TRASH */}
        <section className="border-b border-rule py-10">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">1. The trash fee</h2>
          <p className="mt-2 max-w-[64ch] text-[1rem] leading-relaxed text-ink-mid">
            The year&apos;s loudest fight, and the one lever the Council could pull on its own. Trash runs as a break-even account;
            whatever residents don&apos;t pay in fees, the general fund covers, pulling money from everything else. The higher the fee, the
            less the general fund covers, and the smaller the gap the cuts have to close. It also means residents pay more directly.
            That&apos;s the trade.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {(Object.keys(TRASH) as TrashKey[]).map((k) => {
              const t = TRASH[k];
              const on = trash === k;
              return (
                <button key={k} onClick={() => setTrash(k)} aria-pressed={on} className="rounded-md border bg-bg px-4 py-3.5 text-left transition-colors" style={{ borderColor: on ? "var(--color-gold-strong)" : "var(--color-rule)", borderWidth: on ? 2 : 1 }}>
                  <div className="flex items-center justify-between">
                    <span className="text-[0.6875rem] font-semibold uppercase tracking-wide" style={{ color: on ? "var(--color-gold-strong)" : "var(--color-ink-faint)" }}>
                      {k === "A" ? "Do nothing" : k === "C" ? "What they did" : "Mayor's plan"}
                    </span>
                    {t.adopted && <span className="rounded-sm bg-gold-strong px-1.5 py-0.5 text-[0.6875rem] font-bold uppercase text-white">Adopted</span>}
                  </div>
                  <div className="mt-1 font-display text-[1rem] font-bold">{t.fee}</div>
                  <div className="mt-1 text-[0.78125rem] text-ink-mid">Households: {t.household}</div>
                  <div className="mt-1.5 text-[0.78125rem] tabular-nums text-ink-faint">Cuts must cover: <b className="text-ink">{fmtM(t.gap)}</b></div>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-faint">{TRASH[trash].note} At this fee the general fund still covers {TRASH[trash].gf} of the trash program, leaving <b className="text-ink">{fmtM(TRASH[trash].gap)}</b>{" "}for the cuts below to close.</p>
        </section>

        {/* LEVER 2: MAYOR CUTS */}
        <section className="border-b border-rule py-10">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">2. The cuts that balanced the budget</h2>
          <p className="mt-2 max-w-[64ch] text-[1rem] leading-relaxed text-ink-mid">
            These are the reductions in the mayor&apos;s proposed budget, the ones that actually close the gap, switched <b>on</b>. Toggle
            one <b>off</b>{" "}to put the service back, and the budget falls short by that amount. Then you have to find it elsewhere. Almost
            every dollar here is a job or a service someone uses.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            {MAYOR_CUTS.map((c) => {
              const on = mayorKept[c.id];
              return (
                <label key={c.id} className="flex cursor-pointer items-start gap-3 rounded-md border border-rule bg-bg-card/40 px-4 py-3">
                  <input type="checkbox" checked={on} onChange={(e) => setMayorKept((p) => ({ ...p, [c.id]: e.target.checked }))} className="mt-0.5 h-4 w-4 shrink-0" style={{ accentColor: "var(--color-debt)" }} />
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className={`text-[0.9375rem] font-medium ${on ? "text-ink" : "text-ink-faint line-through"}`}>{c.nm}</span>
                      <span className="shrink-0 text-[0.8125rem] font-bold tabular-nums" style={{ color: on ? "var(--color-debt)" : "var(--color-ink-faint)" }}>{on ? `−${fmt(c.amt)}` : "restored"}</span>
                    </div>
                    <div className="mt-0.5 text-[0.78125rem] leading-relaxed text-ink-faint">
                      {c.note}
                      {c.jobs > 0 && <span className="text-ink-mid"> {on ? (c.jobs === 1 ? "1 position gone." : `About ${c.jobs} positions gone.`) : (c.jobs === 1 ? "Restores 1 position." : `Restores about ${c.jobs} positions.`)}</span>}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
          <p className="mt-3 text-[0.8125rem] italic text-ink-faint">Kept as-is, these cuts total {fmtM(MAYOR_TOTAL)}, exactly what the adopted trash fee left to close. That&apos;s why the budget starts balanced.</p>
        </section>

        {/* LEVER 3: COUNCIL CUTS → FREE CASH */}
        <section className="border-b border-rule py-10">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">3. What the Council cut during review</h2>
          <p className="mt-2 max-w-[64ch] text-[1rem] leading-relaxed text-ink-mid">
            On June 23 the Council added <b>{fmt(COUNCIL_TOTAL)}</b>{" "}more in cuts, on top of a budget the mayor had already balanced. Here
            is the part that surprises people: these don&apos;t close the gap. The budget was already closed. They land in{" "}
            <b>free cash</b>{" "}instead, one-time money that can&apos;t pay for recurring services. So these cuts eliminated positions to
            generate savings that legally can&apos;t be spent on positions.
          </p>
          <div className="mt-5 flex flex-col gap-2">
            {COUNCIL_CUTS.map((c) => {
              const on = councilKept[c.id];
              return (
                <label key={c.id} className="flex cursor-pointer items-start gap-3 rounded-md border border-l-4 border-rule border-l-gold bg-bg-card/40 px-4 py-3">
                  <input type="checkbox" checked={on} onChange={(e) => setCouncilKept((p) => ({ ...p, [c.id]: e.target.checked }))} className="mt-0.5 h-4 w-4 shrink-0" style={{ accentColor: "var(--color-gold-strong)" }} />
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <span className={`text-[0.9375rem] font-medium ${on ? "text-ink" : "text-ink-faint line-through"}`}>{c.nm}</span>
                      <span className="shrink-0 text-[0.8125rem] font-bold tabular-nums" style={{ color: on ? "var(--color-gold-strong)" : "var(--color-ink-faint)" }}>{on ? `→ ${fmt(c.amt)}` : "restored"}</span>
                    </div>
                    <div className="mt-0.5 text-[0.78125rem] leading-relaxed text-ink-faint">{c.note} Council vote {c.vote}.{c.jobs > 0 && <span className="text-ink-mid"> {on ? "1 position gone." : "Restores 1 position."}</span>}</div>
                  </div>
                </label>
              );
            })}
          </div>
          <p className="mt-3 text-[0.8125rem] italic text-ink-faint">Kept on, these add {fmt(COUNCIL_TOTAL)} to free cash, not to the operating budget. Toggle them off and the budget still balances; you simply generate less one-time cash.</p>
        </section>

        {/* LEVER 4: REVENUE SIDE */}
        <section className="border-b border-rule py-10">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">4. The revenue side</h2>
          <p className="mt-2 max-w-[64ch] text-[1rem] leading-relaxed text-ink-mid">
            More money coming in means fewer cuts. But almost none of this is the Council&apos;s to decide. Property taxes are hard-capped
            by state law. The rest needs someone else to say yes: the voters, the unions, the institutions, or the market. Each lever
            carries the condition that would have to be true first.
          </p>

          {/* property taxes + override — one unit; they travel together in practice */}
          <div className="mt-5 rounded-md border border-rule bg-bg-card/40 px-4 py-3">
            {/* the base levy: locked and capped */}
            <div className="flex items-baseline justify-between gap-3">
              <span className="flex flex-wrap items-center gap-2 text-[0.9375rem] font-medium text-ink">
                Property taxes
                <span className="rounded-sm px-1.5 py-0.5 text-[0.6875rem] font-bold uppercase tracking-wide" style={{ background: tintInk(), color: "var(--color-ink-faint)" }}>locked · capped</span>
              </span>
              <span className="shrink-0 text-[0.8125rem] font-bold tabular-nums text-ink">{fmtM(LEVY)}</span>
            </div>
            <div className="mt-0.5 text-[0.78125rem] leading-relaxed text-ink-faint">
              Beverly&apos;s biggest revenue source, about {TAX_SHARE}% of the budget. Under Proposition 2½ the levy can grow only 2.5% a year, plus whatever new construction adds, and the city already taxes to that cap. The one way past it is a voter override.
            </div>

            {/* the override travels with the levy: a deliberate add-on, revealed on demand */}
            <div className="mt-3 border-t border-rule pt-3">
              {!overrideOn ? (
                <button
                  onClick={() => setOverrideOn(true)}
                  className="flex w-full items-center justify-center gap-1.5 rounded-md border border-accent bg-accent/5 px-3 py-2 text-[0.8125rem] font-semibold text-accent transition-colors hover:bg-accent/10"
                >
                  <span aria-hidden className="text-[1rem] leading-none">+</span> Add a Proposition 2½ override
                </button>
              ) : (
                <>
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="flex flex-wrap items-center gap-2 text-[0.9375rem] font-medium text-ink">
                      Proposition 2½ override
                      <button onClick={() => { setOverrideOn(false); setOverride(0); }} className="text-[0.6875rem] font-semibold uppercase tracking-wide text-ink-faint transition-colors hover:text-debt">Remove</button>
                    </span>
                    <span className="shrink-0 text-[0.8125rem] font-bold tabular-nums text-accent">{override > 0 ? `+${fmt(override)}` : "drag to set"}</span>
                  </div>
                  <input type="range" min={0} max={OVERRIDE_MAX} step={100000} value={override} onChange={(e) => setOverride(+e.target.value)} aria-label="Override size" className="mt-2 w-full" style={{ accentColor: "var(--color-accent)", height: 22 }} />
                  <div className="mt-0.5 text-[0.78125rem] leading-relaxed text-ink-faint">The only way to raise property taxes past the cap, and the only lever that can close the whole gap on its own. It is a permanent increase and requires a majority citywide vote. Beverly has never passed one; Marblehead did, in 2026.</div>
                </>
              )}
            </div>
          </div>

          {/* development / new growth — locked default, unlock sits beside the badge */}
          <div className="mt-2 rounded-md border border-rule bg-bg-card/40 px-4 py-3">
            <div className="flex items-baseline justify-between gap-3">
              <span className="flex flex-wrap items-center gap-2 text-[0.9375rem] font-medium text-ink">
                New development this year
                {!devOn ? (
                  <span className="flex items-center gap-1.5">
                    <span className="rounded-sm px-1.5 py-0.5 text-[0.6875rem] font-bold uppercase tracking-wide" style={{ background: tintInk(), color: "var(--color-ink-faint)" }}>locked</span>
                    <button onClick={() => setDevOn(true)} className="rounded-sm border border-accent px-1.5 py-0.5 text-[0.6875rem] font-bold uppercase tracking-wide text-accent transition-colors hover:bg-accent/10">Unlock</button>
                  </span>
                ) : (
                  <span className="rounded-sm px-1.5 py-0.5 text-[0.6875rem] font-bold uppercase tracking-wide" style={{ background: "color-mix(in srgb, var(--color-accent) 14%, var(--color-bg))", color: "var(--color-accent-deep)" }}>exploring</span>
                )}
              </span>
              <span className="shrink-0 text-[0.8125rem] font-bold tabular-nums" style={{ color: devOn && dev !== DEV.actual ? (dev > DEV.actual ? "var(--color-accent)" : "var(--color-debt)") : "var(--color-ink-faint)" }}>
                {devOn ? (dev === DEV.actual ? "as budgeted" : `${dev > DEV.actual ? "+" : "−"}${fmt(Math.abs(dev - DEV.actual))}`) : fmtM(DEV.actual)}
              </span>
            </div>
            <input
              type="range" min={DEV.min} max={DEV.max} step={10000} value={dev} disabled={!devOn}
              onChange={(e) => setDev(+e.target.value)} aria-label="New growth this year"
              className={`mt-2 w-full ${devOn ? "" : "cursor-not-allowed opacity-40"}`}
              style={{ accentColor: "var(--color-accent)", height: 22 }}
            />
            <div className="relative mt-1 h-4 text-[0.6875rem] text-ink-faint">
              {[
                { v: DEV.low, l: "10-yr low" },
                { v: DEV.planned, l: "Dec forecast" },
                { v: DEV.actual, l: "FY27 budget" },
                { v: DEV.high, l: "10-yr high" },
              ].map((m) => (
                <span key={m.l} className="absolute -translate-x-1/2 whitespace-nowrap" style={{ left: `${((m.v - DEV.min) / (DEV.max - DEV.min)) * 100}%` }}>
                  <span className="block h-1.5 w-px bg-ink-faint/50" /> {m.l}
                </span>
              ))}
            </div>
            {!devOn ? (
              <div className="mt-2 text-[0.78125rem] leading-relaxed text-ink-faint">
                The FY2027 budget counts on <b className="text-ink">{fmtM(DEV.actual)}</b>{" "}of new construction added to the tax rolls, a strong year by recent standards. The state certifies the final figure later, when the tax rate is set. Beverly can&apos;t simply dial this up; it depends on the market and years of permitting. Unlock to explore the decade&apos;s range.
              </div>
            ) : (
              <div className="mt-2 text-[0.78125rem] leading-relaxed text-ink-faint">
                Over the last decade Beverly&apos;s new growth ran from {fmtM(DEV.low)} (2016) to {fmtM(DEV.high)} (2018), averaging {fmtM(DEV.mean)}. This year&apos;s budgeted {fmtM(DEV.actual)} sits near the top. Notice the December forecast had assumed only {fmtM(DEV.planned)}, well below what the city usually delivers. That gap is the headroom the development strategy works in.
              </div>
            )}
          </div>

          {/* GIC + PILOT toggles */}
          <div className="mt-2 flex flex-col gap-2">
            {REV.map((r) => {
              const on = rev[r.id];
              return (
                <div key={r.id} className="rounded-md border border-rule bg-bg-card/40 px-4 py-3">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input type="checkbox" checked={on} onChange={(e) => setRev((p) => ({ ...p, [r.id]: e.target.checked }))} className="mt-0.5 h-4 w-4 shrink-0" style={{ accentColor: "var(--color-accent)" }} />
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="flex flex-wrap items-center gap-2 text-[0.9375rem] font-medium text-ink">
                          {r.nm}
                          <span className="rounded-sm px-1.5 py-0.5 text-[0.6875rem] font-bold uppercase tracking-wide" style={{ background: "color-mix(in srgb, var(--color-gold) 18%, var(--color-bg))", color: "var(--color-gold-strong)" }}>{r.tag}</span>
                        </span>
                        <span className="shrink-0 text-[0.8125rem] font-bold tabular-nums text-accent">+{fmt(r.amt)}</span>
                      </div>
                      <div className="mt-0.5 text-[0.78125rem] leading-relaxed text-ink-faint">{r.cond}</div>
                    </div>
                  </label>
                  <details className="mt-1.5 pl-7">
                    <summary className="w-fit cursor-pointer list-none text-[0.75rem] font-semibold text-accent hover:underline">Why this figure?</summary>
                    <p className="mt-1 max-w-[62ch] text-[0.75rem] leading-relaxed text-ink-faint">{r.why}</p>
                  </details>
                </div>
              );
            })}
          </div>
        </section>

        {/* LEVER 5: DEEPER */}
        <section className="border-b border-rule py-10">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">5. Still short? Cut deeper</h2>
          <p className="mt-2 max-w-[64ch] text-[1rem] leading-relaxed text-ink-mid">
            If you put services back or lowered the fee, this is where the money runs out. The big departments, cut <b>on top of</b>{" "}what
            the city already did. Watch the job count climb, and how fast you reach schools, police, and fire, because that&apos;s where
            the money is.
          </p>
          <div className="mt-5">
            {DEEPER.map((d) => {
              const pct = deeper[d.id] ?? 0;
              const cut = d.amt * (pct / 100);
              return (
                <div key={d.id} className="border-t border-rule py-3.5 first:border-t-0">
                  <div className="flex items-baseline justify-between gap-3">
                    <span className="font-display text-[1.0625rem] font-semibold">{d.nm}</span>
                    <span className="whitespace-nowrap text-[0.8125rem] text-ink-faint">budget {fmtM(d.amt)}</span>
                  </div>
                  <input type="range" min={0} max={15} step={1} value={pct} onChange={(e) => setDeeper((p) => ({ ...p, [d.id]: +e.target.value }))} aria-label={`Cut ${d.nm} deeper`} className="mt-2 w-full" style={{ accentColor: "var(--color-debt)", height: 22 }} />
                  <div className="mt-0.5 flex items-baseline justify-between gap-3 text-[0.8125rem]">
                    <span className="text-ink-faint">{pct === 0 ? "No further cut" : `cut ${pct}% more · about ${jobsOf(cut)} positions`}</span>
                    <span className="font-bold tabular-nums text-debt">{pct === 0 ? "" : `−${fmt(cut)}`}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* verdict */}
        <section className="py-10">
          <div className="rounded-md bg-ink px-6 py-6 text-bg">
            {short ? (
              <>
                <p className="font-display text-2xl font-extrabold leading-tight text-white sm:text-3xl">The budget is {fmt(-operating)} short.</p>
                <p className="mt-2 max-w-[62ch] text-bg/85">
                  A city budget has to balance by law, so something has to give: raise the trash fee, put a cut back, reach for revenue that
                  isn&apos;t guaranteed, or cut deeper. That&apos;s the squeeze in one sentence. The money exists, but it&apos;s almost all
                  people who do things for the city, and the levers that aren&apos;t cuts all come with a catch.
                </p>
              </>
            ) : (
              <>
                <p className="font-display text-2xl font-extrabold leading-tight sm:text-3xl" style={{ color: "#bfe6cd" }}>
                  Balanced. {jobs > 0 ? `The bill: about ${Math.round(jobs)} city ${Math.round(jobs) === 1 ? "job" : "jobs"}` : "And nobody lost a job"}
                  {freeCash > 25000 ? `, plus ${fmtC(freeCash)} to free cash.` : "."}
                </p>
                <p className="mt-2 max-w-[62ch] text-bg/85">
                  {atCityDefault({ trash, mayorKept, councilKept, rev, override, devOn, deeper })
                    ? "That's the budget the city actually passed: the middle trash fee, the cuts in the proposed budget that balanced it, and the Council's extra cuts landing in free cash. Now move a lever. Every version balances a different way, and somebody pays for each one."
                    : "You found a balance the city could have chosen. Money left over rolls to free cash, which can't fund services next year. And the gap itself comes back larger. The real debate was never whether the money exists. It's which of these trades the town is willing to live with."}
                </p>
              </>
            )}
          </div>
        </section>

        {/* footer */}
        <footer className="pb-8 text-[0.84375rem] leading-relaxed text-ink-faint [&_b]:font-semibold [&_b]:text-ink">
          <p className="mb-3 max-w-[72ch]">
            <b>How this works.</b>{" "}The trash options, the itemized cuts, the Council amendments, and this year&apos;s new growth are from
            Beverly&apos;s FY2027 budget and the <Link href="/work/beverly/fy27-budget" className="rlink">FY2027 walkthrough</Link>. The cuts in the mayor&apos;s
            proposed budget balance it. The reading that the Council&apos;s June-23 additions sat on top of an already-balanced budget, and
            so land in free cash rather than closing anything, is this tool&apos;s, drawn from the sequence of votes rather than stated in
            any city document. Job estimates assume an average position, with benefits, costs about $95,000. Revenue levers marked{" "}
            <i>estimated</i> are rough figures shown to convey scale and the conditions attached, not to predict.
          </p>
          <p className="mb-3 max-w-[72ch]">
            <b>On free cash.</b>{" "}The {fmtM(FREE_CASH * 1e6)}{" "}is Beverly&apos;s FY2026 certified free cash, the most recent figure, from the
            city&apos;s FY2026-2030 financial forecast. New-growth history is the state Division of Local Services 11-year series;
            FY2027&apos;s {fmtM(DEV.actual)} is the figure in the adopted budget, and {fmtM(DEV.planned)} is what the December 2025 forecast had assumed. Both are estimates: new growth is certified by the state at tax-rate setting, months after the budget passes.
          </p>
          <p className="mb-3 max-w-[72ch]">
            <b>The gap grows.</b>{" "}Toward ${TRAJ[0].toFixed(1)}M in FY2028, then ${TRAJ[1].toFixed(1)}M, then ${TRAJ[2].toFixed(1)}M if
            nothing structural changes, so balancing it once doesn&apos;t make it go away. What a decade of these choices says about the
            town is the subject of a companion piece, coming soon.
          </p>
          <p className="mb-3 max-w-[72ch]">
            <b>On the department budgets.</b>{" "}In lever 5, the school figure is the FY2027 appropriation. Police, fire, and public works
            are their FY2026 budgets, because the city does not publish a departmental breakdown at that level for FY2027. They are shown
            to convey relative scale, not as FY2027 figures.
          </p>
        </footer>
      </div>

      {/* sticky HUD */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-ink py-2.5 text-white shadow-[0_-10px_30px_-14px_rgba(0,0,0,.6)]">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-6 sm:gap-4">
          <div className="whitespace-nowrap">
            <span className="font-display text-xl font-extrabold tabular-nums sm:text-2xl" style={{ color: short ? "#f0b8a8" : "#bfe6cd" }}>
              {short ? `−${fmt(-operating)}` : "Balanced"}
            </span>{" "}
            <span className="text-[0.8125rem] text-white/70">{short ? "short" : "✓"}</span>
          </div>
          <div className="h-3 min-w-[50px] flex-1 overflow-hidden rounded-full bg-white/15">
            <div className="h-full rounded-full transition-[width] duration-150" style={{ width: `${ratio}%`, background: short ? "var(--color-debt)" : "var(--color-accent-lt)" }} />
          </div>
          <div className="hidden whitespace-nowrap text-[0.75rem] text-white/80 sm:block">
            {!short && freeCash > 25000 ? `${fmtC(freeCash)} free cash · ` : ""}{Math.round(jobs)} {Math.round(jobs) === 1 ? "job" : "jobs"} cut
          </div>
        </div>
      </div>
    </div>
  );
}

function tintInk() {
  return "color-mix(in srgb, var(--color-ink) 8%, var(--color-bg))";
}

/* is the sandbox exactly at what the city did? */
function atCityDefault(s: {
  trash: TrashKey; mayorKept: Record<string, boolean>; councilKept: Record<string, boolean>;
  rev: Record<string, boolean>; override: number; devOn: boolean; deeper: Record<string, number>;
}) {
  return (
    s.trash === "C" &&
    MAYOR_CUTS.every((c) => s.mayorKept[c.id]) &&
    COUNCIL_CUTS.every((c) => s.councilKept[c.id]) &&
    !Object.values(s.rev).some(Boolean) &&
    s.override === 0 &&
    !s.devOn &&
    !Object.values(s.deeper).some((v) => v > 0)
  );
}
