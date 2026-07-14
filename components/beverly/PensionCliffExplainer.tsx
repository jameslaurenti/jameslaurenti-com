"use client";

import { useState } from "react";
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ReferenceDot, ResponsiveContainer, Label,
} from "recharts";
import pension from "@/data/beverly/pension.json";

/*
  Beverly's Pension Cliff — an explainer.
  Ported from docs/beverly/reference/PensionCliffExplainer.jsx. All figures come
  from the shared data layer (data/beverly/pension.json), sourced from the PERAC
  Beverly Contributory Retirement System Actuarial Valuation, January 1, 2024.
*/

// Chart marks are SVG: fill/stroke attributes do not resolve CSS var(), so these
// literals mirror the @theme tokens in app/globals.css. Keep them in sync.
const C = {
  accent: "#2d6a4f",      // --color-accent
  accentDeep: "#1e4d38",  // --color-accent-deep
  debt: "#b0562b",        // --color-debt
  gold: "#b8923a",        // --color-gold
  ink: "#1a1815",         // --color-ink
  inkMid: "#4d4840",      // --color-ink-mid
  rule: "rgba(0,0,0,0.09)", // --color-rule
};

// Data layer. Adopted PERAC schedule: permanent = normal cost + expenses + net
// 3(8)(c); debt = amortization of the unfunded actuarial liability. The schema
// carries year-end unfunded liability as `ualEnd`; the chart reads `ual`.
const schedule = pension.schedule.map((r) => ({ ...r, ual: r.ualEnd }));
const funded = pension.fundedRatioScenarios.series;
const cliff = pension.cliff;

const scenarios = {
  s7: {
    key: "s7", label: "7% returns", tag: "The adopted plan",
    color: C.accent,
    headline: "The debt clears on schedule, in FY32 and FY33.",
    body: "This is the schedule the Retirement Board adopted and PERAC approved. It is not the optimistic case. Beverly's pension fund has returned 7.8% a year over the past 20 years and 9.5% over the past 5, both above the 7% the plan assumes. If the fund simply performs as expected, the debt payment ends as drawn.",
  },
  s5: {
    key: "s5", label: "5% returns", tag: "Headwind",
    color: C.gold,
    headline: "The debt still clears, a few years late.",
    body: "A stretch of middling returns doesn't cancel the payoff, it delays it. The unfunded liability falls more slowly, the next valuation resets the payment higher, and full funding drifts toward PERAC's FY35 backstop instead of FY33. The relief arrives. The bridge is just longer than the base case assumes.",
  },
  s3: {
    key: "s3", label: "3% returns", tag: "Stress case",
    color: C.debt,
    headline: "The bridge breaks. Costs rise instead of falling.",
    body: "This is PERAC's own stress scenario, not a guess. At 3% returns the unfunded liability climbs to $86.5M by 2029 instead of falling to $39M, and the report warns the payment \"might have to be increased before FY29.\" Full funding slides well past FY35. The pension line keeps growing through the whole window. This is the scenario the strategy has to survive, and it is set by markets, not by Beverly.",
  },
};

// Funding history arc. Sequence, so a timeline is the right device.
const timeline = [
  { year: "1937", label: "Chapter 32 promises pensions. They are funded pay-as-you-go.", accent: "forest" },
  { year: "1988", label: "Reform. Massachusetts ranks second-worst nationally. A 40-year payoff schedule is set.", accent: "forest" },
  { year: "2008", label: "Market crash. The statewide backstop is stretched out to 2040.", accent: "debt" },
  { year: "2024", label: "Beverly reaches 75.3% funded, up from 51.6% in 2014.", accent: "forest" },
  { year: "FY33", label: "Beverly's inherited debt is cleared.", accent: "gold" },
];

const fmtM = (v: number) => `$${v.toFixed(1)}M`;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="pc-eyebrow">{children}</div>;
}

function ScheduleTooltip({ active, payload, label }: { active?: boolean; payload?: unknown[]; label?: string }) {
  if (!active || !payload || !payload.length) return null;
  const row = schedule.find((r) => r.fy === label);
  if (!row) return null;
  const cleared = row.debt === 0;
  return (
    <div className="pc-tip">
      <div className="pc-tip-fy">{label}{cleared ? " · debt cleared" : ""}</div>
      <div style={{ color: C.debt }}>Debt payment {fmtM(row.debt)}</div>
      <div style={{ color: C.accent }}>Permanent cost {fmtM(row.permanent)}</div>
      <div className="pc-tip-total">Total {fmtM(row.total)}</div>
      <div className="pc-tip-ual">Remaining debt {fmtM(row.ual)}</div>
    </div>
  );
}

function FundedTooltip({ active, payload, label }: { active?: boolean; payload?: unknown[]; label?: string }) {
  if (!active || !payload || !payload.length) return null;
  const row = funded.find((r) => r.yr === label);
  if (!row) return null;
  return (
    <div className="pc-tip">
      <div className="pc-tip-fy">{label}{row.firm ? "" : " · illustrative"}</div>
      <div style={{ color: C.accent }}>7%: {row.s7}%</div>
      <div style={{ color: C.gold }}>5%: {row.s5}%</div>
      <div style={{ color: C.debt }}>3%: {row.s3}%</div>
    </div>
  );
}

export default function PensionCliffExplainer() {
  const [scn, setScn] = useState<keyof typeof scenarios>("s7");
  const active = scenarios[scn];

  // FY27 mortgage-style breakdown
  const fy27 = schedule.find((r) => r.fy === "FY27")!;
  const fy27PermPct = (fy27.permanent / fy27.total) * 100;

  return (
    <div className="pc-root">
      <style>{`
        .pc-root {
          --pc-surface: #ffffff;
          --pc-bridge-bg: #fbf3ee;
          background: var(--color-bg); color: var(--color-ink);
          font-family: var(--font-sans), system-ui, sans-serif;
          padding: clamp(20px, 5vw, 72px) clamp(16px, 4vw, 40px);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }
        .pc-root svg text { font-family: var(--font-sans), system-ui, sans-serif; }
        .pc-wrap { max-width: 760px; margin: 0 auto; }
        .pc-eyebrow {
          font-size: 12px; font-weight: 600; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--color-accent); margin-bottom: 14px;
        }
        .pc-h1 {
          font-family: var(--font-display), system-ui, sans-serif; font-weight: 800;
          font-size: clamp(30px, 6vw, 52px); line-height: 1.04;
          letter-spacing: -0.02em; margin: 0 0 20px; color: var(--color-ink);
        }
        .pc-lede {
          font-size: clamp(17px, 2.4vw, 20px); line-height: 1.55;
          color: var(--color-ink); margin: 0 0 8px; max-width: 640px;
        }
        .pc-lede b { color: var(--color-accent); font-weight: 600; }
        .pc-section { margin-top: clamp(44px, 7vw, 72px); }
        .pc-h2 {
          font-family: var(--font-display), system-ui, sans-serif; font-weight: 700;
          font-size: clamp(23px, 3.6vw, 30px); line-height: 1.12;
          letter-spacing: -0.01em; margin: 0 0 16px; color: var(--color-ink);
        }
        .pc-p { font-size: 16.5px; color: var(--color-ink); margin: 0 0 16px; }
        .pc-p.soft { color: var(--color-ink-mid); }
        .pc-card {
          background: var(--pc-surface); border: 1px solid var(--color-rule);
          border-radius: 10px; padding: clamp(18px, 3vw, 28px);
        }
        .pc-fignote {
          font-size: 12.5px; color: var(--color-ink-mid); margin-top: 12px;
          line-height: 1.5;
        }
        /* mortgage bar */
        .pc-bar {
          display: flex; height: 64px; border-radius: 8px; overflow: hidden;
          border: 1px solid var(--color-rule); margin: 4px 0 14px;
        }
        .pc-bar-seg {
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-weight: 600; font-size: 14px; padding: 0 8px;
          text-align: center;
        }
        .pc-legend { display: flex; flex-wrap: wrap; gap: 8px 20px; font-size: 13.5px; margin-top: 4px; }
        .pc-legend span { display: inline-flex; align-items: center; gap: 7px; }
        .pc-sw { width: 13px; height: 13px; border-radius: 3px; display: inline-block; }
        /* timeline */
        .pc-timeline { margin: 6px 0 2px; }
        .pc-tl-track { display: grid; grid-template-columns: repeat(5, 1fr); position: relative; }
        .pc-tl-line { position: absolute; top: 5px; left: 10%; right: 10%; height: 2px; background: var(--color-rule); }
        .pc-tl-node { position: relative; text-align: center; padding: 0 8px; }
        .pc-tl-dot { width: 12px; height: 12px; border-radius: 50%; background: var(--color-accent); position: relative; z-index: 1; margin: 0 auto 14px; box-shadow: 0 0 0 3px var(--pc-surface); }
        .pc-tl-dot[data-accent="debt"] { background: var(--color-debt); }
        .pc-tl-dot[data-accent="gold"] { background: var(--color-gold); }
        .pc-tl-year { font-family: var(--font-display), system-ui, sans-serif; font-weight: 700; font-size: 15px; color: var(--color-ink); margin-bottom: 5px; }
        .pc-tl-label { font-size: 12.5px; color: var(--color-ink-mid); line-height: 1.45; }
        @media (max-width: 640px) {
          .pc-tl-track { grid-template-columns: 1fr; }
          .pc-tl-line { display: none; }
          .pc-tl-node { text-align: left; display: flex; gap: 13px; align-items: baseline; padding: 11px 0; border-bottom: 1px solid var(--color-rule); }
          .pc-tl-node:last-child { border-bottom: none; }
          .pc-tl-dot { margin: 0; flex: 0 0 auto; align-self: center; box-shadow: none; }
          .pc-tl-year { flex: 0 0 42px; margin-bottom: 0; }
        }
        /* scenario toggle */
        .pc-toggle { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; }
        .pc-tab {
          font-family: var(--font-sans), system-ui, sans-serif; font-size: 14px; font-weight: 600;
          padding: 9px 15px; border-radius: 999px; cursor: pointer;
          border: 1.5px solid var(--color-rule); background: transparent;
          color: var(--color-ink-mid); transition: all .15s ease;
        }
        .pc-tab:hover { border-color: var(--color-accent); color: var(--color-accent); }
        .pc-tab[data-on="true"] { color: #fff; border-color: transparent; }
        .pc-readout { margin-top: 18px; }
        .pc-readout-tag {
          font-size: 12px; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; margin-bottom: 6px;
        }
        .pc-readout-head {
          font-family: var(--font-display), system-ui, sans-serif; font-weight: 700;
          font-size: 20px; line-height: 1.2; margin: 0 0 10px; color: var(--color-ink);
        }
        .pc-readout-body { font-size: 15.5px; color: var(--color-ink); margin: 0; }
        /* catch grid */
        .pc-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 620px) { .pc-grid { grid-template-columns: 1fr 1fr; } }
        .pc-catch { background: var(--pc-surface); border: 1px solid var(--color-rule); border-left: 3px solid var(--color-debt); border-radius: 8px; padding: 18px 20px; }
        .pc-catch h4 { font-family: var(--font-display), system-ui, sans-serif; font-weight: 700; font-size: 16.5px; margin: 0 0 7px; color: var(--color-ink); }
        .pc-catch p { font-size: 14.5px; color: var(--color-ink-mid); margin: 0; line-height: 1.55; }
        /* bridge-years box */
        .pc-bridgebox { margin-top: 22px; background: var(--pc-bridge-bg); border: 1px solid var(--color-debt); border-radius: 10px; padding: clamp(18px, 3vw, 26px); }
        .pc-bridgebox-label { font-family: var(--font-display), system-ui, sans-serif; font-weight: 700; font-size: 17px; color: var(--color-debt); margin-bottom: 9px; }
        .pc-bridgebox p { font-size: 15.5px; color: var(--color-ink); margin: 0; line-height: 1.6; }
        /* stat row */
        .pc-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--color-rule); border: 1px solid var(--color-rule); border-radius: 10px; overflow: hidden; margin: 22px 0; }
        .pc-stat { background: var(--pc-surface); padding: 18px 16px; }
        .pc-stat-n { font-family: var(--font-display), system-ui, sans-serif; font-weight: 800; font-size: clamp(22px, 4vw, 30px); color: var(--color-accent); line-height: 1; letter-spacing: -0.01em; }
        .pc-stat-l { font-size: 12.5px; color: var(--color-ink-mid); margin-top: 7px; line-height: 1.4; }
        /* tooltip */
        .pc-tip { background: var(--color-ink); color: #f2f5f0; padding: 10px 12px; border-radius: 7px; font-size: 12.5px; line-height: 1.65; box-shadow: 0 6px 20px rgba(0,0,0,.18); }
        .pc-tip-fy { font-weight: 700; margin-bottom: 3px; letter-spacing: .03em; }
        .pc-tip-total { border-top: 1px solid rgba(255,255,255,.2); margin-top: 5px; padding-top: 5px; font-weight: 600; }
        .pc-tip-ual { color: #b9c6bf; margin-top: 2px; }
        .pc-foot { margin-top: clamp(40px, 6vw, 60px); padding-top: 20px; border-top: 1px solid var(--color-rule); font-size: 13px; color: var(--color-ink-mid); line-height: 1.65; }
        .pc-foot b { color: var(--color-ink); font-weight: 600; }
        .pc-foot p { margin: 0 0 10px; }
        @media (prefers-reduced-motion: reduce) { .pc-root * { animation: none !important; transition: none !important; } }
      `}</style>

      <div className="pc-wrap">
        {/* HERO */}
        <Eyebrow>Beverly · General Fund · The Pension Line</Eyebrow>
        <h1 className="pc-h1">Most of Beverly&apos;s pension bill is old debt, and it is scheduled to end. Getting to that date is the hard part.</h1>
        <p className="pc-lede">
          Roughly two thirds of what Beverly pays into its pension system each year is not for today&apos;s pensions. It is catch-up on money that was never set aside decades ago, back when almost every city and state in the country funded pensions the same way: paying retirees as the bills came due and saving nothing for the promises still being earned. Think of it as a <b>mortgage the city inherited</b> on decades of past service. Beverly is most of the way through paying it, on a plan that clears around <b>FY33</b> and would free about <b>$12.8 million a year</b>. That reframes the whole budget. But three things keep it from being good news yet: the end date depends on investment returns and can slip, the payment climbs for several more years before it falls, and much of the money that frees up is already spoken for.
        </p>

        {/* SECTION 1: the mortgage */}
        <div className="pc-section">
          <Eyebrow>How the payment works</Eyebrow>
          <h2 className="pc-h2">Two costs wearing one label</h2>
          <p className="pc-p">
            Every year Beverly appropriates one number for &quot;retirement.&quot; Inside that number are two very different things. The smaller part is <b style={{color:C.accent}}>normal cost</b>: the pensions current employees earn this year. That part is permanent. It never goes away, because the city always has working employees.
          </p>
          <p className="pc-p">
            The larger part is a <b style={{color:C.debt}}>debt payment</b>. For decades Beverly, like most Massachusetts cities, did not set aside enough to cover the pensions it had promised. State law (Chapter 32) requires closing that gap on a fixed schedule, the same way a mortgage retires a loan. Beverly&apos;s schedule pays the debt off by FY33.
          </p>

          <div className="pc-card" style={{ marginTop: 22 }}>
            <div style={{ fontSize: 13.5, color: C.inkMid, marginBottom: 4, fontWeight: 600 }}>
              FY27 pension appropriation, {fmtM(fy27.total)}
            </div>
            <div className="pc-bar">
              <div className="pc-bar-seg" style={{ width: `${fy27PermPct}%`, background: C.accent }}>
                {fy27PermPct > 22 ? `Permanent ${fmtM(fy27.permanent)}` : fmtM(fy27.permanent)}
              </div>
              <div className="pc-bar-seg" style={{ width: `${100 - fy27PermPct}%`, background: C.debt }}>
                Debt payment {fmtM(fy27.debt)}
              </div>
            </div>
            <div className="pc-legend">
              <span><i className="pc-sw" style={{ background: C.accent }} /> Normal cost, permanent</span>
              <span><i className="pc-sw" style={{ background: C.debt }} /> Unfunded-liability payment, ends FY33</span>
            </div>
            <div className="pc-fignote">
              The debt payment is 71% of the FY27 pension line. When it retires, the permanent cost is all that remains.
            </div>
          </div>
        </div>

        {/* SECTION: where the debt came from */}
        <div className="pc-section">
          <Eyebrow>Where the debt came from</Eyebrow>
          <h2 className="pc-h2">A fifty-year-old bill, almost paid</h2>
          <p className="pc-p">
            The debt is not the result of one bad budget, and it is not unique to Beverly. For most of the last century, cities and states across the country funded pensions the cheapest way available: pay-as-you-go. They paid retirees as the checks came due and set nothing aside for the pensions their current workers were earning. Three slower forces widened the gap almost everywhere: people began living longer and drawing pensions for more years, workers could retire earlier, and benefits grew more generous over time. Do that across every employee for decades and a large cost builds up off the books, one that took shape long before today&apos;s officials or taxpayers arrived.
          </p>
          <p className="pc-p">
            To be clear, the retirees always got paid. Their checks came out of each year&apos;s taxes, the same budget that covered police and schools. What was missing was the saving. Money set aside early and invested would have grown for decades and carried much of the load, and none was. It is like a family that always covered a parent&apos;s bills from each month&apos;s paycheck but never funded a retirement account of their own. Nothing went unpaid. There was simply no nest egg when their own time came, so the whole promise has to be funded now, by hand.
          </p>
          <p className="pc-p">
            By 1988 the bill had come due statewide. Massachusetts had the second-worst-funded public pensions in the country, most systems covering only 20 to 40 cents of every dollar promised. That year the Legislature forced the reckoning: every city had to start funding pensions properly and pay down the accumulated hole on a fixed schedule. Beverly has been climbing that schedule ever since, from barely half-funded in 2014 to 75% today.
          </p>

          <div className="pc-card">
            <div className="pc-timeline">
              <div className="pc-tl-track">
                <div className="pc-tl-line" />
                {timeline.map((t) => (
                  <div className="pc-tl-node" key={t.year}>
                    <div className="pc-tl-dot" data-accent={t.accent} />
                    <div className="pc-tl-year">{t.year}</div>
                    <div className="pc-tl-label">{t.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="pc-p" style={{ marginTop: 22 }}>
            Two facts change how to read that bill. Today&apos;s taxpayer is covering labor consumed generations ago: the residents of the 1960s and 70s got the police, fire, and teaching they were promised without paying the full cost, and that cost landed here. And this is not a bonus pension. Most Beverly municipal employees are not in Social Security, so the pension replaces it. The city funds the pension instead of paying the federal Social Security tax, and the workers themselves contribute 9 to 11 cents of every paycheck.
          </p>
          <p className="pc-p">
            One choice was Beverly&apos;s own. After the 2008 crash, the state let communities stretch the payoff out to a 2040 backstop. Beverly&apos;s retirement board kept a shorter schedule that finishes by FY33. The tradeoff runs both ways: a longer schedule lowers today&apos;s payment and carries the debt further into the future, while a shorter one costs more now and ends sooner.
          </p>
        </div>

        {/* SECTION 2: the schedule (signature) */}
        <div className="pc-section">
          <Eyebrow>The payoff schedule</Eyebrow>
          <h2 className="pc-h2">The debt rises, then it stops</h2>
          <p className="pc-p">
            This is the schedule PERAC approved, and it is a plan, not a guarantee. The debt payment climbs about 4.5% a year by design, since a rising schedule keeps the early payments lower. It peaks in FY31, then falls in two steps: a smaller final payment in FY32, and zero in FY33. So the near-term reality is a payment that gets heavier before it drops. And because the schedule is rebuilt every couple of years against actual investment returns, the FY33 date can move. Watch the orange.
          </p>

          <div className="pc-card">
            <div style={{ width: "100%", height: 360 }}>
              <ResponsiveContainer>
                <ComposedChart data={schedule} margin={{ top: 30, right: 14, bottom: 4, left: 2 }}>
                  <CartesianGrid stroke={C.rule} strokeDasharray="2 4" vertical={false} />
                  <XAxis dataKey="fy" tick={{ fontSize: 12, fill: C.inkMid }}
                    axisLine={{ stroke: C.rule }} tickLine={false} />
                  <YAxis tickFormatter={(v) => `$${v}M`} domain={[0, 20]}
                    tick={{ fontSize: 12, fill: C.inkMid }}
                    axisLine={false} tickLine={false} width={46} />
                  <Tooltip content={<ScheduleTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
                  <Area type="monotone" dataKey="permanent" stackId="a" stroke={C.accent}
                    strokeWidth={0} fill={C.accent} fillOpacity={0.9} isAnimationActive={false} name="Permanent cost" />
                  <Area type="monotone" dataKey="debt" stackId="a" stroke={C.debt}
                    strokeWidth={0} fill={C.debt} fillOpacity={0.85} isAnimationActive={false} name="Debt payment" />
                  <ReferenceLine x="FY32" stroke={C.ink} strokeDasharray="4 4" strokeOpacity={0.45}>
                    <Label value="debt retires →" position="top" offset={10}
                      style={{ fontSize: 11.5, fill: C.ink, fontWeight: 600 }} />
                  </ReferenceLine>
                  <ReferenceDot x={cliff.peakFy} y={cliff.peakTotal} r={4} fill={C.debt} stroke="#fff" strokeWidth={1.5} />
                  <ReferenceDot x={cliff.clearedFy} y={cliff.clearedTotal} r={4} fill={C.accent} stroke="#fff" strokeWidth={1.5} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="pc-legend" style={{ marginTop: 10 }}>
              <span><i className="pc-sw" style={{ background: C.accent }} /> Permanent cost</span>
              <span><i className="pc-sw" style={{ background: C.debt }} /> Debt payment</span>
            </div>
          </div>

          <div className="pc-stats">
            <div className="pc-stat">
              <div className="pc-stat-n">{fmtM(cliff.peakTotal)}</div>
              <div className="pc-stat-l">Peak pension payment, {cliff.peakFy}</div>
            </div>
            <div className="pc-stat">
              <div className="pc-stat-n">{fmtM(cliff.clearedTotal)}</div>
              <div className="pc-stat-l">Payment once debt clears, {cliff.clearedFy}</div>
            </div>
            <div className="pc-stat">
              <div className="pc-stat-n">~{fmtM(cliff.annualReliefApprox)}</div>
              <div className="pc-stat-l">Freed per year, permanent</div>
            </div>
          </div>
          <p className="pc-p soft">
            The drop comes in two steps. FY32 frees about $6.8M as the final debt payment shrinks. FY33 frees another $5.9M as it hits zero. After that, Beverly pays only the permanent cost, which keeps growing slowly with payroll.
          </p>
        </div>

        {/* SECTION 3: what could move the date */}
        <div className="pc-section">
          <Eyebrow>What could move the date</Eyebrow>
          <h2 className="pc-h2">The payoff depends on investment returns</h2>
          <p className="pc-p">
            The schedule assumes the pension fund earns 7% a year, the return PERAC and the retirement board adopted. It gets reset every two years against what the fund actually earned. Strong returns pull the payoff closer. Weak returns push it out, and a bad enough stretch pushes the payment up before it ever comes down. The same math applies after the debt clears: a bad market year can open a new gap and start a new payment, so &quot;fully funded&quot; is a milestone, not a permanent state. Toggle the assumption to see the range.
          </p>

          <div className="pc-card">
            <div className="pc-toggle">
              {Object.values(scenarios).map((s) => (
                <button key={s.key} className="pc-tab" data-on={scn === s.key}
                  style={scn === s.key ? { background: s.color } : {}}
                  onClick={() => setScn(s.key as keyof typeof scenarios)}>
                  {s.label}
                </button>
              ))}
            </div>

            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <ComposedChart data={funded} margin={{ top: 16, right: 14, bottom: 4, left: 2 }}>
                  <CartesianGrid stroke={C.rule} strokeDasharray="2 4" vertical={false} />
                  <XAxis dataKey="yr" tick={{ fontSize: 11.5, fill: C.inkMid }}
                    axisLine={{ stroke: C.rule }} tickLine={false} interval={1} />
                  <YAxis domain={[60, 105]} tickFormatter={(v) => `${v}%`}
                    tick={{ fontSize: 11.5, fill: C.inkMid }}
                    axisLine={false} tickLine={false} width={42} />
                  <Tooltip content={<FundedTooltip />} cursor={{ stroke: C.rule }} />
                  <ReferenceLine y={100} stroke={C.accentDeep} strokeDasharray="5 4" strokeOpacity={0.6}>
                    <Label value="fully funded · debt gone" position="insideTopLeft" offset={8}
                      style={{ fontSize: 11, fill: C.accentDeep, fontWeight: 600 }} />
                  </ReferenceLine>
                  <ReferenceLine x="2029" stroke={C.rule} strokeWidth={1}>
                    <Label value="projection ends · rest illustrative" position="top" angle={0} offset={8}
                      style={{ fontSize: 9.5, fill: C.inkMid }} />
                  </ReferenceLine>
                  <Line type="monotone" dataKey="s3" stroke={C.debt}
                    strokeWidth={scn === "s3" ? 3 : 1.4} strokeOpacity={scn === "s3" ? 1 : 0.3}
                    dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="s5" stroke={C.gold}
                    strokeWidth={scn === "s5" ? 3 : 1.4} strokeOpacity={scn === "s5" ? 1 : 0.3}
                    dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="s7" stroke={C.accent}
                    strokeWidth={scn === "s7" ? 3 : 1.4} strokeOpacity={scn === "s7" ? 1 : 0.3}
                    dot={false} isAnimationActive={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="pc-readout">
              <div className="pc-readout-tag" style={{ color: active.color }}>{active.tag}</div>
              <p className="pc-readout-head">{active.headline}</p>
              <p className="pc-readout-body">{active.body}</p>
            </div>
            <div className="pc-fignote">
              Funded ratio = assets divided by what the system owes. 100% means the debt is gone. The 7% and 3% paths through 2029 are PERAC&apos;s own projection. The 5% path, and everything past 2029, is illustrative.
            </div>
          </div>
        </div>

        {/* SECTION 4: what the freed money is for */}
        <div className="pc-section">
          <Eyebrow>When the debt clears</Eyebrow>
          <h2 className="pc-h2">What the freed money is already meant for</h2>
          <p className="pc-p">
            Clearing the debt frees roughly $12.8M a year. It helps to sort that money into two buckets: what Beverly will still owe no matter what, and what it could choose to do with the rest.
          </p>
          <div className="pc-grid">
            <div className="pc-catch">
              <h4>The permanent cost stays</h4>
              <p>Even after the debt is paid, Beverly still owes the normal cost, about $5.8M in FY33, for the pensions current workers keep earning. It grows slowly with payroll. Fully funded means the old gap is closed, not that pensions are free.</p>
            </div>
            <div className="pc-catch">
              <h4>A likely first claim: retiree health care</h4>
              <p>Beverly owes a second, separate promise: health care for its retirees, known as OPEB. It is large and, today, barely pre-funded. It is the kind of gap that grows more expensive the longer it waits, which makes it a natural place to direct freed pension money.</p>
            </div>
            <div className="pc-catch">
              <h4>A choice: deferred capital projects</h4>
              <p>Some of the room could go toward buildings the city has been putting off, such as a possible school project and the proposed public services building, both of which would land in the early 2030s. These are decisions, not obligations, and they compete with the claims above.</p>
            </div>
            <div className="pc-catch">
              <h4>Real, but not a windfall</h4>
              <p>The relief is real and worth planning around. It is not money to spend freely. Between the permanent cost, retiree health, rising health-insurance costs, and any new building debt, much of it is claimed before it arrives. Confirm each figure against current city budget documents.</p>
            </div>
          </div>
        </div>

        {/* SECTION 5: why it matters */}
        <div className="pc-section">
          <Eyebrow>Why it matters</Eyebrow>
          <h2 className="pc-h2">A dated problem is a different problem</h2>
          <p className="pc-p">
            Beverly faces a structural gap: costs are growing faster than the 2.5% a year that Proposition 2½ allows revenue to grow. That is real, and it compounds. But it is not open-ended. The single largest fixed cost in the budget has a scheduled expiration, and on the base case it lands around FY33.
          </p>
          <p className="pc-p">
            That reframes the whole question. The city is not staring at a deficit that grows forever. It is looking at a bridge to a specific year, after which more than $12M a year comes back into the budget. What Beverly needs is a way across that bridge: enough new revenue and restraint to hold services together until the debt clears, without spending down every reserve to get there. The pieces that follow, on new growth, on payments from tax-exempt institutions, and on what an override would and would not buy, are all really about the same thing. How to reach the far side of this cliff in one piece.
          </p>

          <div className="pc-bridgebox">
            <div className="pc-bridgebox-label">The bridge years carry their own risk</div>
            <p>
              The far side is dated. The crossing is not guaranteed. Four things could deepen the deficit before FY33 arrives: the roughly $2.5M a year in federal grants the schools rely on, which the city says it could not replace; health insurance running near 10% a year on a self-insured plan; a handful of high-cost special education placements, which can swing more than $1M in a single year; and a recession, which would hit local receipts and new growth at once. Plan the bridge for the hard version, not the smooth one.
            </p>
          </div>
        </div>

        {/* FIDELITY FOOTER */}
        <div className="pc-foot">
          <p><b>Sources and fidelity.</b> The funding schedule, funded status, and the two-step payoff are firm, taken directly from the PERAC Beverly Contributory Retirement System Actuarial Valuation dated January 1, 2024 (adopted schedule, page 9). As of that valuation the system was <b>75.3% funded</b> with a <b>$65.6M</b> unfunded liability and a <b>7.0%</b> return assumption.</p>
          <p>The 3% stress path is PERAC&apos;s own five-year projection (page 22), including its warning that at 3% returns &quot;the funding schedule might have to be increased before FY29.&quot; The 5% path, and any figure past 2029 or FY33, is an illustrative extension, not a PERAC number. Funding schedules are reset roughly every two years; the January 1, 2026 valuation will update these figures using actual 2024 and 2025 returns.</p>
          <p>Return history from the same valuation: the fund returned 11.4% in 2023, 9.5% annualized over five years, 8.0% over ten, and 7.8% over twenty. Beverly does carry a separate retiree-health (OPEB) liability, valued under GASB 75, which the city funds mostly pay-as-you-go rather than pre-funding. Its size, the status of any school building project or public services building, and the exact claims on the freed pension capacity should all be confirmed against current city budget and actuarial documents before publication.</p>
        </div>
      </div>
    </div>
  );
}
