import React, { useState } from "react";
import {
  ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, ReferenceDot, ResponsiveContainer, Label,
} from "recharts";

/*
  Beverly's Pension Cliff — an explainer
  Source of truth: PERAC, Beverly Contributory Retirement System
  Actuarial Valuation, January 1, 2024 (adopted funding schedule, p.9;
  5-year return projection, p.22). Figures in $millions.

  Design system (jameslaurenti.com): forest #2d6a4f, Bricolage Grotesque
  display, DM Sans body. Clean register.
*/

const T = {
  bg: "#eef2ec",
  surface: "#ffffff",
  ink: "#16241d",
  inkSoft: "#55645b",
  forest: "#2d6a4f",
  forestDeep: "#1e4d38",
  debt: "#b0562b",
  debtSoft: "rgba(176,86,43,0.12)",
  forestSoft: "rgba(45,106,79,0.12)",
  rule: "#dde3d9",
  gold: "#b8923a",
};

// Adopted PERAC schedule. permanent = normal cost + expenses + net 3(8)(c).
// debt = amortization of unfunded actuarial liability.
const schedule = [
  { fy: "FY25", permanent: 4.11, debt: 10.15, total: 14.27, ual: 67.9 },
  { fy: "FY26", permanent: 4.29, debt: 10.62, total: 14.91, ual: 62.2 },
  { fy: "FY27", permanent: 4.48, debt: 11.10, total: 15.58, ual: 55.5 },
  { fy: "FY28", permanent: 4.68, debt: 11.61, total: 16.28, ual: 47.9 },
  { fy: "FY29", permanent: 4.88, debt: 12.13, total: 17.02, ual: 39.3 },
  { fy: "FY30", permanent: 5.10, debt: 12.69, total: 17.78, ual: 29.5 },
  { fy: "FY31", permanent: 5.32, debt: 13.26, total: 18.58, ual: 18.4 },
  { fy: "FY32", permanent: 5.55, debt: 6.18, total: 11.74, ual: 6.0 },
  { fy: "FY33", permanent: 5.80, debt: 0.0, total: 5.80, ual: 0.0 },
];

// Funded-ratio scenarios. 2024–2029 @7% and @3% are PERAC's projection (p.22).
// 5% path and all values past 2029 are illustrative extensions.
const funded = [
  { yr: "2024", s7: 73.3, s5: 73.3, s3: 73.3, firm: true },
  { yr: "2025", s7: 75.9, s5: 74.6, s3: 73.0, firm: true },
  { yr: "2026", s7: 78.6, s5: 75.9, s3: 72.8, firm: true },
  { yr: "2027", s7: 81.4, s5: 77.3, s3: 72.6, firm: true },
  { yr: "2028", s7: 84.4, s5: 78.9, s3: 72.5, firm: true },
  { yr: "2029", s7: 87.5, s5: 80.6, s3: 72.3, firm: true },
  { yr: "2030", s7: 91.0, s5: 83.0, s3: 72.1, firm: false },
  { yr: "2031", s7: 95.0, s5: 86.0, s3: 71.9, firm: false },
  { yr: "2032", s7: 98.0, s5: 89.5, s3: 71.7, firm: false },
  { yr: "2033", s7: 100, s5: 93.0, s3: 71.5, firm: false },
  { yr: "2034", s7: 100, s5: 96.5, s3: 71.3, firm: false },
  { yr: "2035", s7: 100, s5: 100, s3: 71.1, firm: false },
];

const scenarios = {
  s7: {
    key: "s7", label: "7% returns", tag: "The adopted plan",
    color: T.forest,
    headline: "The debt clears on schedule, in FY32 and FY33.",
    body: "This is the schedule the Retirement Board adopted and PERAC approved. It is not the optimistic case. Beverly's pension fund has returned 7.8% a year over the past 20 years and 9.5% over the past 5, both above the 7% the plan assumes. If the fund simply performs as expected, the debt payment ends as drawn.",
  },
  s5: {
    key: "s5", label: "5% returns", tag: "Headwind",
    color: T.gold,
    headline: "The debt still clears, a few years late.",
    body: "A stretch of middling returns doesn't cancel the payoff, it delays it. The unfunded liability falls more slowly, the next valuation resets the payment higher, and full funding drifts toward PERAC's FY35 backstop instead of FY33. The relief arrives. The bridge is just longer than the base case assumes.",
  },
  s3: {
    key: "s3", label: "3% returns", tag: "Stress case",
    color: T.debt,
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

const fmtM = (v) => `$${v.toFixed(1)}M`;

function Eyebrow({ children }) {
  return <div className="pc-eyebrow">{children}</div>;
}

function ScheduleTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  const row = schedule.find((r) => r.fy === label);
  if (!row) return null;
  const cleared = row.debt === 0;
  return (
    <div className="pc-tip">
      <div className="pc-tip-fy">{label}{cleared ? " · debt cleared" : ""}</div>
      <div style={{ color: T.debt }}>Debt payment {fmtM(row.debt)}</div>
      <div style={{ color: T.forest }}>Permanent cost {fmtM(row.permanent)}</div>
      <div className="pc-tip-total">Total {fmtM(row.total)}</div>
      <div className="pc-tip-ual">Remaining debt {fmtM(row.ual)}</div>
    </div>
  );
}

function FundedTooltip({ active, payload, label, active_key }) {
  if (!active || !payload || !payload.length) return null;
  const row = funded.find((r) => r.yr === label);
  if (!row) return null;
  return (
    <div className="pc-tip">
      <div className="pc-tip-fy">{label}{row.firm ? "" : " · illustrative"}</div>
      <div style={{ color: T.forest }}>7%: {row.s7}%</div>
      <div style={{ color: T.gold }}>5%: {row.s5}%</div>
      <div style={{ color: T.debt }}>3%: {row.s3}%</div>
    </div>
  );
}

export default function PensionCliffExplainer() {
  const [scn, setScn] = useState("s7");
  const active = scenarios[scn];

  // FY27 mortgage-style breakdown
  const fy27 = schedule.find((r) => r.fy === "FY27");
  const fy27PermPct = (fy27.permanent / fy27.total) * 100;

  return (
    <div className="pc-root">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,600;12..96,700;12..96,800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

        .pc-root {
          --bg:${T.bg}; --surface:${T.surface}; --ink:${T.ink};
          --inkSoft:${T.inkSoft}; --forest:${T.forest}; --debt:${T.debt};
          --rule:${T.rule};
          background: var(--bg); color: var(--ink);
          font-family: 'DM Sans', system-ui, sans-serif;
          padding: clamp(20px, 5vw, 72px) clamp(16px, 4vw, 40px);
          line-height: 1.6;
          -webkit-font-smoothing: antialiased;
        }
        .pc-wrap { max-width: 760px; margin: 0 auto; }
        .pc-eyebrow {
          font-size: 12px; font-weight: 600; letter-spacing: 0.14em;
          text-transform: uppercase; color: var(--forest); margin-bottom: 14px;
        }
        .pc-h1 {
          font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800;
          font-size: clamp(30px, 6vw, 52px); line-height: 1.04;
          letter-spacing: -0.02em; margin: 0 0 20px; color: var(--ink);
        }
        .pc-lede {
          font-size: clamp(17px, 2.4vw, 20px); line-height: 1.55;
          color: var(--ink); margin: 0 0 8px; max-width: 640px;
        }
        .pc-lede b { color: var(--forest); font-weight: 600; }
        .pc-section { margin-top: clamp(44px, 7vw, 72px); }
        .pc-h2 {
          font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700;
          font-size: clamp(23px, 3.6vw, 30px); line-height: 1.12;
          letter-spacing: -0.01em; margin: 0 0 16px; color: var(--ink);
        }
        .pc-p { font-size: 16.5px; color: var(--ink); margin: 0 0 16px; }
        .pc-p.soft { color: var(--inkSoft); }
        .pc-card {
          background: var(--surface); border: 1px solid var(--rule);
          border-radius: 10px; padding: clamp(18px, 3vw, 28px);
        }
        .pc-fignote {
          font-size: 12.5px; color: var(--inkSoft); margin-top: 12px;
          line-height: 1.5;
        }
        /* mortgage bar */
        .pc-bar {
          display: flex; height: 64px; border-radius: 8px; overflow: hidden;
          border: 1px solid var(--rule); margin: 4px 0 14px;
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
        .pc-tl-line { position: absolute; top: 5px; left: 10%; right: 10%; height: 2px; background: var(--rule); }
        .pc-tl-node { position: relative; text-align: center; padding: 0 8px; }
        .pc-tl-dot { width: 12px; height: 12px; border-radius: 50%; background: var(--forest); position: relative; z-index: 1; margin: 0 auto 14px; box-shadow: 0 0 0 3px var(--surface); }
        .pc-tl-dot[data-accent="debt"] { background: var(--debt); }
        .pc-tl-dot[data-accent="gold"] { background: ${T.gold}; }
        .pc-tl-year { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 15px; color: var(--ink); margin-bottom: 5px; }
        .pc-tl-label { font-size: 12.5px; color: var(--inkSoft); line-height: 1.45; }
        @media (max-width: 640px) {
          .pc-tl-track { grid-template-columns: 1fr; }
          .pc-tl-line { display: none; }
          .pc-tl-node { text-align: left; display: flex; gap: 13px; align-items: baseline; padding: 11px 0; border-bottom: 1px solid var(--rule); }
          .pc-tl-node:last-child { border-bottom: none; }
          .pc-tl-dot { margin: 0; flex: 0 0 auto; align-self: center; box-shadow: none; }
          .pc-tl-year { flex: 0 0 42px; margin-bottom: 0; }
        }
        /* scenario toggle */
        .pc-toggle { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 18px; }
        .pc-tab {
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 600;
          padding: 9px 15px; border-radius: 999px; cursor: pointer;
          border: 1.5px solid var(--rule); background: transparent;
          color: var(--inkSoft); transition: all .15s ease;
        }
        .pc-tab:hover { border-color: var(--forest); color: var(--forest); }
        .pc-tab[data-on="true"] { color: #fff; border-color: transparent; }
        .pc-readout { margin-top: 18px; }
        .pc-readout-tag {
          font-size: 12px; font-weight: 700; letter-spacing: 0.1em;
          text-transform: uppercase; margin-bottom: 6px;
        }
        .pc-readout-head {
          font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700;
          font-size: 20px; line-height: 1.2; margin: 0 0 10px; color: var(--ink);
        }
        .pc-readout-body { font-size: 15.5px; color: var(--ink); margin: 0; }
        /* catch grid */
        .pc-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 620px) { .pc-grid { grid-template-columns: 1fr 1fr; } }
        .pc-catch { background: var(--surface); border: 1px solid var(--rule); border-left: 3px solid var(--debt); border-radius: 8px; padding: 18px 20px; }
        .pc-catch h4 { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 16.5px; margin: 0 0 7px; color: var(--ink); }
        .pc-catch p { font-size: 14.5px; color: var(--inkSoft); margin: 0; line-height: 1.55; }
        /* bridge-years box */
        .pc-bridgebox { margin-top: 22px; background: #fbf3ee; border: 1px solid ${T.debt}; border-radius: 10px; padding: clamp(18px, 3vw, 26px); }
        .pc-bridgebox-label { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 700; font-size: 17px; color: ${T.debt}; margin-bottom: 9px; }
        .pc-bridgebox p { font-size: 15.5px; color: var(--ink); margin: 0; line-height: 1.6; }
        /* stat row */
        .pc-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: var(--rule); border: 1px solid var(--rule); border-radius: 10px; overflow: hidden; margin: 22px 0; }
        .pc-stat { background: var(--surface); padding: 18px 16px; }
        .pc-stat-n { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: clamp(22px, 4vw, 30px); color: var(--forest); line-height: 1; letter-spacing: -0.01em; }
        .pc-stat-l { font-size: 12.5px; color: var(--inkSoft); margin-top: 7px; line-height: 1.4; }
        /* tooltip */
        .pc-tip { background: ${T.ink}; color: #f2f5f0; padding: 10px 12px; border-radius: 7px; font-size: 12.5px; line-height: 1.65; box-shadow: 0 6px 20px rgba(0,0,0,.18); }
        .pc-tip-fy { font-weight: 700; margin-bottom: 3px; letter-spacing: .03em; }
        .pc-tip-total { border-top: 1px solid rgba(255,255,255,.2); margin-top: 5px; padding-top: 5px; font-weight: 600; }
        .pc-tip-ual { color: #b9c6bf; margin-top: 2px; }
        .pc-foot { margin-top: clamp(40px, 6vw, 60px); padding-top: 20px; border-top: 1px solid var(--rule); font-size: 13px; color: var(--inkSoft); line-height: 1.65; }
        .pc-foot b { color: var(--ink); font-weight: 600; }
        .pc-foot p { margin: 0 0 10px; }
        @media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
      `}</style>

      <div className="pc-wrap">
        {/* HERO */}
        <Eyebrow>Beverly · General Fund · The Pension Line</Eyebrow>
        <h1 className="pc-h1">The pension payment squeezing Beverly's budget has a payoff date.</h1>
        <p className="pc-lede">
          Roughly two thirds of what Beverly pays into its pension system each year is not a pension. It is a <b>debt payment</b> on decades of underfunding, and like a mortgage, it is scheduled to end. On the current plan, it ends in <b>FY33</b>, freeing about <b>$12.8 million a year</b>. That single fact changes how to think about every other budget decision.
        </p>

        {/* SECTION 1: the mortgage */}
        <div className="pc-section">
          <Eyebrow>How the payment works</Eyebrow>
          <h2 className="pc-h2">Two costs wearing one label</h2>
          <p className="pc-p">
            Every year Beverly appropriates one number for "retirement." Inside that number are two very different things. The smaller part is <b style={{color:T.forest}}>normal cost</b>: the pensions current employees earn this year. That part is permanent. It never goes away, because the city always has working employees.
          </p>
          <p className="pc-p">
            The larger part is a <b style={{color:T.debt}}>debt payment</b>. For decades Beverly, like most Massachusetts cities, did not set aside enough to cover the pensions it had promised. State law (Chapter 32) requires closing that gap on a fixed schedule, the same way a mortgage retires a loan. Beverly's schedule pays the debt off by FY33.
          </p>

          <div className="pc-card" style={{ marginTop: 22 }}>
            <div style={{ fontSize: 13.5, color: T.inkSoft, marginBottom: 4, fontWeight: 600 }}>
              FY27 pension appropriation, {fmtM(fy27.total)}
            </div>
            <div className="pc-bar">
              <div className="pc-bar-seg" style={{ width: `${fy27PermPct}%`, background: T.forest }}>
                {fy27PermPct > 22 ? `Permanent ${fmtM(fy27.permanent)}` : fmtM(fy27.permanent)}
              </div>
              <div className="pc-bar-seg" style={{ width: `${100 - fy27PermPct}%`, background: T.debt }}>
                Debt payment {fmtM(fy27.debt)}
              </div>
            </div>
            <div className="pc-legend">
              <span><i className="pc-sw" style={{ background: T.forest }} /> Normal cost, permanent</span>
              <span><i className="pc-sw" style={{ background: T.debt }} /> Unfunded-liability payment, ends FY33</span>
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
            The debt is not the result of one bad budget. It is inherited. For most of the last century, Massachusetts cities funded pensions the cheapest way available: pay-as-you-go. They paid retirees as the checks came due and set nothing aside for the pensions their current workers were earning. A city took thirty years of police work and paid for the pension thirty years later. Do that across every employee for fifty years and you build a debt no one recorded and no resident ever voted for.
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
            Two facts change how to read that bill. Today's taxpayer is covering labor consumed generations ago: the residents of the 1960s and 70s got the police, fire, and teaching they were promised without paying the full cost, and that cost landed here. And this is not a bonus pension. Most Beverly municipal employees are not in Social Security, so the pension replaces it. The city funds the pension instead of paying the federal Social Security tax, and the workers themselves contribute 9 to 11 cents of every paycheck.
          </p>
          <p className="pc-p">
            One decision belongs to Beverly, and it reflects well on the city. When the 2008 crash let communities stretch the payoff out to a 2040 backstop, Beverly's board held a schedule that finishes by FY33, seven years early. Stretching a schedule lowers today's payment and lengthens the burden for everyone who comes after. Beverly took the shorter road.
          </p>
        </div>

        {/* SECTION 2: the schedule (signature) */}
        <div className="pc-section">
          <Eyebrow>The payoff schedule</Eyebrow>
          <h2 className="pc-h2">The debt rises, then it stops</h2>
          <p className="pc-p">
            Here is the full schedule PERAC approved. The debt payment climbs 4.5% a year by design (a rising schedule keeps early payments lower), peaks in FY31, then falls off in two steps: a partial final payment in FY32, and zero in FY33. Watch the orange.
          </p>

          <div className="pc-card">
            <div style={{ width: "100%", height: 360 }}>
              <ResponsiveContainer>
                <ComposedChart data={schedule} margin={{ top: 30, right: 14, bottom: 4, left: 2 }}>
                  <CartesianGrid stroke={T.rule} strokeDasharray="2 4" vertical={false} />
                  <XAxis dataKey="fy" tick={{ fontFamily: "'DM Sans'", fontSize: 12, fill: T.inkSoft }}
                    axisLine={{ stroke: T.rule }} tickLine={false} />
                  <YAxis tickFormatter={(v) => `$${v}M`} domain={[0, 20]}
                    tick={{ fontFamily: "'DM Sans'", fontSize: 12, fill: T.inkSoft }}
                    axisLine={false} tickLine={false} width={46} />
                  <Tooltip content={<ScheduleTooltip />} cursor={{ fill: "rgba(0,0,0,0.03)" }} />
                  <Area type="monotone" dataKey="permanent" stackId="a" stroke={T.forest}
                    strokeWidth={0} fill={T.forest} fillOpacity={0.9} isAnimationActive={false} name="Permanent cost" />
                  <Area type="monotone" dataKey="debt" stackId="a" stroke={T.debt}
                    strokeWidth={0} fill={T.debt} fillOpacity={0.85} isAnimationActive={false} name="Debt payment" />
                  <ReferenceLine x="FY32" stroke={T.ink} strokeDasharray="4 4" strokeOpacity={0.45}>
                    <Label value="debt retires →" position="top" offset={10}
                      style={{ fontFamily: "'DM Sans'", fontSize: 11.5, fill: T.ink, fontWeight: 600 }} />
                  </ReferenceLine>
                  <ReferenceDot x="FY31" y={18.58} r={4} fill={T.debt} stroke="#fff" strokeWidth={1.5} />
                  <ReferenceDot x="FY33" y={5.80} r={4} fill={T.forest} stroke="#fff" strokeWidth={1.5} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="pc-legend" style={{ marginTop: 10 }}>
              <span><i className="pc-sw" style={{ background: T.forest }} /> Permanent cost</span>
              <span><i className="pc-sw" style={{ background: T.debt }} /> Debt payment</span>
            </div>
          </div>

          <div className="pc-stats">
            <div className="pc-stat">
              <div className="pc-stat-n">$18.6M</div>
              <div className="pc-stat-l">Peak pension payment, FY31</div>
            </div>
            <div className="pc-stat">
              <div className="pc-stat-n">$5.8M</div>
              <div className="pc-stat-l">Payment once debt clears, FY33</div>
            </div>
            <div className="pc-stat">
              <div className="pc-stat-n">~$12.8M</div>
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
            The schedule assumes the pension fund earns 7% a year. It gets reset every two years against what the fund actually earned. Strong returns pull the payoff closer. Weak returns push it out, and a bad enough stretch pushes the payment up before it ever comes down. Toggle the assumption to see the fan.
          </p>

          <div className="pc-card">
            <div className="pc-toggle">
              {Object.values(scenarios).map((s) => (
                <button key={s.key} className="pc-tab" data-on={scn === s.key}
                  style={scn === s.key ? { background: s.color } : {}}
                  onClick={() => setScn(s.key)}>
                  {s.label}
                </button>
              ))}
            </div>

            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <ComposedChart data={funded} margin={{ top: 16, right: 14, bottom: 4, left: 2 }}>
                  <CartesianGrid stroke={T.rule} strokeDasharray="2 4" vertical={false} />
                  <XAxis dataKey="yr" tick={{ fontFamily: "'DM Sans'", fontSize: 11.5, fill: T.inkSoft }}
                    axisLine={{ stroke: T.rule }} tickLine={false} interval={1} />
                  <YAxis domain={[60, 105]} tickFormatter={(v) => `${v}%`}
                    tick={{ fontFamily: "'DM Sans'", fontSize: 11.5, fill: T.inkSoft }}
                    axisLine={false} tickLine={false} width={42} />
                  <Tooltip content={<FundedTooltip />} cursor={{ stroke: T.rule }} />
                  <ReferenceLine y={100} stroke={T.forestDeep} strokeDasharray="5 4" strokeOpacity={0.6}>
                    <Label value="fully funded · debt gone" position="insideTopLeft" offset={8}
                      style={{ fontFamily: "'DM Sans'", fontSize: 11, fill: T.forestDeep, fontWeight: 600 }} />
                  </ReferenceLine>
                  <ReferenceLine x="2029" stroke={T.rule} strokeWidth={1}>
                    <Label value="projection ends · rest illustrative" position="top" angle={0} offset={8}
                      style={{ fontFamily: "'DM Sans'", fontSize: 9.5, fill: T.inkSoft }} />
                  </ReferenceLine>
                  <Line type="monotone" dataKey="s3" stroke={T.debt}
                    strokeWidth={scn === "s3" ? 3 : 1.4} strokeOpacity={scn === "s3" ? 1 : 0.3}
                    dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="s5" stroke={T.gold}
                    strokeWidth={scn === "s5" ? 3 : 1.4} strokeOpacity={scn === "s5" ? 1 : 0.3}
                    dot={false} isAnimationActive={false} />
                  <Line type="monotone" dataKey="s7" stroke={T.forest}
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
              Funded ratio = assets divided by what the system owes. 100% means the debt is gone. The 7% and 3% paths through 2029 are PERAC's own projection. The 5% path, and everything past 2029, is illustrative.
            </div>
          </div>
        </div>

        {/* SECTION 4: the catch */}
        <div className="pc-section">
          <Eyebrow>The catch</Eyebrow>
          <h2 className="pc-h2">Four things the relief is not</h2>
          <div className="pc-grid">
            <div className="pc-catch">
              <h4>It is not the end of pension costs</h4>
              <p>The permanent cost, about $5.8M in FY33, stays and keeps growing with payroll. "Fully funded" means the old debt is paid, not that pensions are free.</p>
            </div>
            <div className="pc-catch">
              <h4>It is not permanent by itself</h4>
              <p>A bad market year after FY33 creates new unfunded liability and a new payment. In PERAC's words, losses can "return a fully funded system to a less than fully funded status." The cliff can partly grow back.</p>
            </div>
            <div className="pc-catch">
              <h4>It is largely spoken for</h4>
              <p>Three claims sit in the same window. Retiree health (OPEB), Beverly's other large unfunded liability, is the prudent place to redirect the freed money, since the city barely pre-funds it today. New capital debt, including a possible school project and the proposed public services building, would land in the early 2030s. And health costs keep compounding faster than revenue underneath it all. The relief is real. It is not found money. Confirm each figure against city budget documents.</p>
            </div>
            <div className="pc-catch">
              <h4>It is not a certain date</h4>
              <p>The FY33 payoff assumes 7% returns. Markets, not the city, decide whether that holds. The scenarios above show the range. Plan to the date, but hedge the risk.</p>
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
          <p>The 3% stress path is PERAC's own five-year projection (page 22), including its warning that at 3% returns "the funding schedule might have to be increased before FY29." The 5% path, and any figure past 2029 or FY33, is an illustrative extension, not a PERAC number. Funding schedules are reset roughly every two years; the January 1, 2026 valuation will update these figures using actual 2024 and 2025 returns.</p>
          <p>Return history from the same valuation: the fund returned 11.4% in 2023, 9.5% annualized over five years, 8.0% over ten, and 7.8% over twenty. Beverly does carry a separate retiree-health (OPEB) liability, valued under GASB 75, which the city funds mostly pay-as-you-go rather than pre-funding. Its size, the status of any school building project or public services building, and the exact claims on the freed pension capacity should all be confirmed against current city budget and actuarial documents before publication.</p>
        </div>
      </div>
    </div>
  );
}
