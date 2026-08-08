"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

/* ---------- phase system ---------- */
type PhaseN = 1 | 2 | 3 | 4;
// `color` is used for TEXT (must pass contrast); `fill` for bars/pills/swatches (bright ok).
// Only trash differs: bright gold reads fine as a fill but fails contrast as text.
const PHASES: { n: PhaseN; id: string; short: string; full: string; color: string; fill: string }[] = [
  { n: 1, id: "revenue", short: "1 · Revenue", full: "Part 1: Revenue +$7.2M", color: "var(--color-accent)", fill: "var(--color-accent)" },
  { n: 2, id: "costs", short: "2 · Costs", full: "Part 2: Cost pressures +$10.0M", color: "var(--color-debt)", fill: "var(--color-debt)" },
  { n: 3, id: "trash", short: "3 · Trash", full: "Part 3: Trash fee covers $1.1M", color: "var(--color-gold-strong)", fill: "var(--color-gold)" },
  { n: 4, id: "cuts", short: "4 · Cuts", full: "Part 4: Remaining cuts $1.8M", color: "var(--color-cuts)", fill: "var(--color-cuts)" },
];
const PASS = "#1a5e6e"; // passthrough (National Grid)
const TONE: Record<string, string> = {
  rev: "var(--color-accent)",
  cost: "var(--color-debt)",
  trash: "var(--color-gold-strong)",
  cuts: "var(--color-cuts)",
  pass: PASS,
  ink: "var(--color-ink)",
  muted: "var(--color-ink-faint)",
};
const tint = (c: string, pct = 10) => `color-mix(in srgb, ${c} ${pct}%, var(--color-bg))`;

/* ---------- mini waterfall chart ---------- */
function MiniChart({ active }: { active: number }) {
  const W = 980, H = 52, pad = 3, gap = 8, n = 4;
  const colW = (W - gap * (n - 1) - pad * 2) / n;
  const nets = [7168, -10050, 1075, 1807];
  const cums = [0];
  nets.forEach((v) => cums.push(cums[cums.length - 1] + v));
  const maxV = Math.max(...cums, 0) * 1.08;
  const minV = Math.min(...cums, 0) * 1.08;
  const span = maxV - minV || 1;
  const y = (v: number) => pad + ((H - pad * 2) * (maxV - v)) / span;
  const xOf = (i: number) => pad + i * (colW + gap);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block h-[46px] w-full sm:h-[52px]" aria-hidden>
      <line x1={0} y1={y(0)} x2={W} y2={y(0)} stroke="rgba(255,255,255,.28)" strokeWidth={1} />
      {PHASES.map((p, i) => {
        const yT = y(Math.max(cums[i], cums[i + 1]));
        const yB = y(Math.min(cums[i], cums[i + 1]));
        const ht = Math.max(2, yB - yT);
        return <rect key={p.n} x={xOf(i)} y={yT} width={colW} height={ht} fill={p.fill} opacity={active === p.n ? 1 : 0.5} />;
      })}
    </svg>
  );
}

/* ---------- small helpers ---------- */
const ExtA = (props: { href: string; children: React.ReactNode }) => (
  <a href={props.href} target="_blank" rel="noopener" className="rlink">
    {props.children}
  </a>
);
const A = (props: { href: string; children: React.ReactNode }) => (
  <Link href={props.href} className="rlink">
    {props.children}
  </Link>
);

type BadgeKind = "confirmed" | "derived" | "passthrough" | "amendment";
function Badge({ kind, children }: { kind: BadgeKind; children: React.ReactNode }) {
  const s: Record<BadgeKind, { bg: string; fg: string; bd?: string }> = {
    confirmed: { bg: tint("var(--color-accent)", 16), fg: "var(--color-accent-deep)" },
    derived: { bg: tint("#2b4258", 14), fg: "#2b4258" },
    passthrough: { bg: tint(PASS, 12), fg: PASS, bd: PASS },
    amendment: { bg: tint("#5a3a7a", 12), fg: "#5a3a7a", bd: "#5a3a7a" },
  };
  const v = s[kind];
  return (
    <span
      className="inline-block rounded-sm px-1.5 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wide"
      style={{ background: v.bg, color: v.fg, border: v.bd ? `1px solid ${v.bd}` : undefined }}
    >
      {children}
    </span>
  );
}

/* ---------- section building blocks ---------- */
function PhaseSection({ n, title, children }: { n: PhaseN; title: string; children: React.ReactNode }) {
  const p = PHASES[n - 1];
  return (
    <section id={p.id} className="scroll-mt-[132px] border-b border-rule py-12 sm:py-14">
      <div className="mb-2 flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.18em]" style={{ color: p.color }}>
        <span className="inline-block h-[3px] w-[18px]" style={{ background: p.fill }} />
        Part {n}
      </div>
      <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">{title}</h2>
      {children}
    </section>
  );
}
function Narrative({ children }: { children: React.ReactNode }) {
  return <p className="mt-4 max-w-[65ch] text-[1rem] leading-relaxed text-ink-mid [&_b]:font-semibold [&_b]:text-ink">{children}</p>;
}
function Topline({ tone, number, children }: { tone: string; number: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 flex flex-col items-start gap-2 rounded-md border border-rule bg-bg-card/50 px-5 py-4 sm:flex-row sm:items-center sm:gap-5">
      <div className="font-display text-5xl font-extrabold leading-none tabular-nums sm:text-6xl" style={{ color: TONE[tone] }}>
        {number}
      </div>
      <div className="max-w-[38ch] text-[0.90625rem] leading-snug text-ink-mid [&_strong]:font-semibold [&_strong]:text-ink">{children}</div>
    </div>
  );
}
function GroupBlock({ name, pct, total, tone, children }: { name: string; pct: string; total: string; tone: string; children?: React.ReactNode }) {
  return (
    <div className="mt-7">
      <div className="flex items-baseline justify-between gap-3 border-b-2 border-ink pb-1.5">
        <span className="text-[0.75rem] font-semibold uppercase tracking-wide text-ink-mid">{name}</span>
        <div className="flex shrink-0 items-baseline gap-2.5">
          <span className="rounded-sm bg-bg-card px-1.5 py-0.5 text-[0.6875rem] tabular-nums text-ink-faint">{pct}</span>
          <span className="font-display text-xl font-bold tabular-nums" style={{ color: TONE[tone] }}>{total}</span>
        </div>
      </div>
      {children}
    </div>
  );
}
function LineRow({
  label, desc, badges, amount, amountTone = "ink", pct, bar,
}: {
  label: string; desc: React.ReactNode; badges: React.ReactNode; amount: string; amountTone?: string; pct?: React.ReactNode; bar?: { pct: number; tone: string };
}) {
  return (
    <div className="grid grid-cols-1 gap-2 border-b border-rule py-3 pl-3.5 sm:grid-cols-[1fr_auto] sm:gap-x-4" style={{ borderLeft: bar ? `3px solid ${TONE[bar.tone]}` : undefined }}>
      <div className="flex flex-col gap-1">
        <span className="text-[0.9375rem] text-ink">{label}</span>
        <span className="max-w-[62ch] text-[0.78125rem] leading-relaxed text-ink-faint">{desc}</span>
        <div className="mt-0.5 flex flex-wrap gap-1">{badges}</div>
      </div>
      <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-1.5">
        <span className="text-[0.875rem] font-semibold tabular-nums" style={{ color: TONE[amountTone] }}>{amount}</span>
        {pct && <span className="text-[0.6875rem] tabular-nums text-ink-faint">{pct}</span>}
        {bar && (
          <div className="hidden h-1.5 w-20 overflow-hidden rounded-full bg-rule sm:block">
            <div className="h-full rounded-full" style={{ width: `${bar.pct}%`, background: TONE[bar.tone] }} />
          </div>
        )}
      </div>
    </div>
  );
}
function ImpactBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="ml-3.5 border-l-2 border-rule bg-bg-card/40 px-3 py-2.5">
      <div className="text-[0.6875rem] font-semibold uppercase tracking-wider text-ink-faint">What residents feel</div>
      <div className="mt-0.5 text-[0.8125rem] leading-relaxed text-ink-mid">{children}</div>
    </div>
  );
}
function Callout({ tone, label, children }: { tone: string; label: string; children: React.ReactNode }) {
  const c = TONE[tone] ?? tone;
  return (
    <div className="my-5 border-l-[3px] px-4 py-3 text-[0.90625rem] leading-relaxed text-ink [&_b]:font-semibold" style={{ borderColor: c, background: tint(c, 8) }}>
      <div className="mb-1 text-[0.6875rem] font-bold uppercase tracking-wider" style={{ color: c }}>{label}</div>
      {children}
    </div>
  );
}
function Critical({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mt-8 overflow-hidden rounded-md border border-rule border-t-[3px] border-t-ink bg-bg-card/40 px-6 py-5">
      <span className="pointer-events-none absolute right-4 top-2 font-display text-5xl font-bold leading-none text-rule" aria-hidden>?</span>
      <div className="mb-3 text-[0.6875rem] font-bold uppercase tracking-[0.16em] text-ink">Questions worth thinking about</div>
      <p className="max-w-[64ch] border-l-[3px] border-ink pl-4 font-display text-[1rem] leading-relaxed text-ink">{children}</p>
    </div>
  );
}

export default function FY27Budget() {
  const [active, setActive] = useState<number>(1);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = PHASES.findIndex((p) => p.id === e.target.id);
            if (idx >= 0) setActive(idx + 1);
          }
        });
      },
      { threshold: 0, rootMargin: "-30% 0px -60% 0px" }
    );
    PHASES.forEach((p) => {
      const el = document.getElementById(p.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const goTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  // footnote refs (dedupe ids for numbers cited more than once)
  const seen = new Set<number>();
  const fn = (nr: number) => {
    const first = !seen.has(nr);
    if (first) seen.add(nr);
    return (
      <a href={`#fn-${nr}`} {...(first ? { id: `fnref-${nr}` } : {})} className="ml-0.5 align-super text-[0.62em] font-bold text-ink-faint no-underline hover:text-ink" aria-label={`Note ${nr}`}>
        [{nr}]
      </a>
    );
  };

  return (
    <div ref={rootRef} className="bg-bg text-ink">
      {/* sticky phase tracker */}
      {/* Stacks below the collection breadcrumb: 3.5rem site nav + 2.25rem breadcrumb. */}
      <div className="sticky top-[5.75rem] z-40 border-b border-black/20 bg-ink px-4 py-2 text-bg shadow-md sm:px-6 sm:py-2.5">
        <div className="mx-auto max-w-3xl">
          <div className="mb-1.5 hidden text-[0.75rem] text-bg/60 sm:block">Track your place in the story as you scroll</div>
          <div className="flex flex-wrap gap-1.5 sm:mb-1.5">
            {PHASES.map((p) => {
              const on = active === p.n;
              return (
                <button
                  key={p.n}
                  onClick={() => goTo(p.id)}
                  aria-pressed={on}
                  className="min-h-[30px] flex-1 rounded-sm border px-2 py-1 text-[0.6875rem] font-semibold uppercase tracking-wide transition-colors sm:flex-none sm:text-[0.6875rem]"
                  style={{
                    background: on ? p.color : "transparent",
                    borderColor: on ? p.color : "rgba(255,255,255,.2)",
                    color: on ? "#fff" : "rgba(255,255,255,.5)",
                  }}
                >
                  <span className="hidden sm:inline">{p.full}</span>
                  <span className="sm:hidden">{p.short}</span>
                </button>
              );
            })}
          </div>
          {/* Hidden on phones: at 375px it is 46px of chrome for a chart you cannot read,
              and the phase buttons above already mark your place. */}
          <div className="hidden sm:block">
            <MiniChart active={active} />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6 pb-24">
        {/* intro */}
        <div className="border-b border-rule py-10 sm:py-14">
          <span className="text-[0.75rem] font-bold uppercase tracking-[0.18em] text-debt">Beverly, Massachusetts · FY2027 budget</span>
          <h1 className="mt-2 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl">
            Rising costs, a structural gap, and how it was closed for one year.
          </h1>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="border-l-[3px] border-debt px-4 py-3" style={{ background: tint("var(--color-debt)", 8) }}>
              <div className="text-[0.6875rem] font-bold uppercase tracking-widest text-debt">Part 1 + 2: the problem</div>
              <p className="mt-1 text-[0.875rem] leading-relaxed text-ink-mid">
                Beverly&apos;s costs grew about $10 million this year. Revenue only grew $7.2 million. That gap is not an accident. The
                biggest drivers of city cost, union wages, health insurance, pensions, and special education, grow faster each year than
                property taxes are legally allowed to. None of it is optional, and it compounds. Proposition 2.5 squeezes nearly every
                city and town in Massachusetts the same way.
              </p>
            </div>
            <div className="border-l-[3px] border-accent px-4 py-3" style={{ background: tint("var(--color-accent)", 8) }}>
              <div className="text-[0.6875rem] font-bold uppercase tracking-widest text-accent">Part 3 + 4: the response</div>
              <p className="mt-1 text-[0.875rem] leading-relaxed text-ink-mid">
                To close a $2.9 million gap, the levers Beverly could pull on its own came down to the trash fee and service cuts. It used
                both. If your first reaction is that canceling the City Hall renovation belongs on that list, that question gets a real
                answer in Part 2, including the part that rarely makes the argument: the timing of the City Hall loans matters more than
                their size this year.
              </p>
            </div>
          </div>
          <p className="mt-6 max-w-[64ch] text-[1rem] leading-relaxed text-ink-mid">
            This piece walks through each part in plain language, with sources noted throughout. It builds on an earlier explainer,{" "}
            <A href="/work/beverly/budget-explainer">How Beverly&apos;s budget works</A>, which lays out why the gap exists in the first
            place. Use the tracker above to follow along.
          </p>
        </div>

        {/* running tally */}
        <div className="my-6 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-rule bg-rule sm:grid-cols-4">
          {[
            { p: 1, val: "+$7.17M", tone: "rev", label: "ahead of FY26 baseline" },
            { p: 2, val: "-$2.88M", tone: "cost", label: "gap to close" },
            { p: 3, val: "-$1.81M", tone: "trash", label: "still remaining" },
            { p: 4, val: "$0", tone: "ink", label: "balanced, as required by law" },
          ].map((c) => (
            <div key={c.p} className="bg-bg px-3.5 py-3.5" style={{ borderTop: `3px solid ${TONE[c.tone]}` }}>
              <div className="text-[0.6875rem] font-semibold uppercase tracking-wider text-ink-faint">
                {c.p === 1 ? "After revenue" : c.p === 2 ? "After costs" : c.p === 3 ? "After trash fee" : "Final result"}
              </div>
              <div className="mt-1 text-xl font-bold tabular-nums" style={{ color: TONE[c.tone] }}>{c.val}</div>
              <div className="mt-1 text-[0.75rem] text-ink-faint">{c.label}</div>
            </div>
          ))}
        </div>

        {/* ===== PART 1: REVENUE ===== */}
        <PhaseSection n={1} title="Where Beverly gets its money">
          <Narrative>
            Beverly raises money through property taxes, state aid, and local fees and excise taxes. Property taxes make up about{" "}
            <b>77 cents of every dollar of city revenue</b>, but a 1980 state law called Proposition 2.5 caps how fast the city can raise
            them. Each year the maximum increase is 2.5% of the prior year&apos;s levy, the total collected from all property taxes, plus
            revenue from newly built properties. Beverly cannot raise property taxes faster than that unless voters approve it: an override
            for ongoing spending, or a debt exclusion, a temporary version tied to a specific borrowing. Beverly has not passed one in
            recent history. Marblehead, next door, approved a $15 million override on June 9, 2026.{fn(1)}{" "}This year, all of Beverly&apos;s
            revenue sources combined brought in $7.2 million more than last year.
          </Narrative>
          <Topline tone="rev" number="+$7.2M">
            <strong>Total new revenue this year</strong>
            <br />
            Compared to FY26. Each category below shows its share of this total.
          </Topline>

          <GroupBlock name="Property and local taxes" pct="72% of revenue growth" total="+$5.17M" tone="rev">
            <LineRow
              label="Property tax increase (2.5% annual cap)"
              desc="Each year the city is legally allowed to raise property taxes by up to 2.5% of the prior year's levy. This is the formula-driven portion, set by state law."
              badges={<Badge kind="confirmed">budget book</Badge>}
              amount="+$3.39M" amountTone="rev" pct="47% of revenue growth" bar={{ pct: 47, tone: "rev" }}
            />
            <LineRow
              label="New construction added to the tax rolls"
              desc="When new buildings are completed and assessed, they are added to Beverly's permanent tax base. The budget counts on $1.95M of it this year, a figure the state certifies later, when the tax rate is set. Unlike a one-time windfall, these properties keep paying taxes going forward. That said, new construction is not guaranteed year to year, and more development, particularly residential, can add pressure on schools, roads, and services."
              badges={<Badge kind="confirmed">budget book</Badge>}
              amount="+$1.95M" amountTone="rev" pct="27% of revenue growth" bar={{ pct: 27, tone: "rev" }}
            />
            <LineRow
              label="Local excise taxes (motor vehicles, meals, hotel, cannabis)"
              desc="Motor vehicle excise (+$215K) and meals/hotel/cannabis taxes (+$115K combined) grew modestly. Cannabis excise is up about 11% as Beverly's dispensaries continue to mature."
              badges={<Badge kind="confirmed">budget book</Badge>}
              amount="+$330K" amountTone="rev" pct="5% of revenue growth" bar={{ pct: 5, tone: "rev" }}
            />
            <LineRow
              label="PILOT payments (Payments In Lieu of Taxes)"
              desc="Certain organizations, such as colleges and hospitals, own property in Beverly but do not pay regular property taxes. Some voluntarily pay a negotiated annual amount instead. Beverly receives $250K per year, unchanged from last year. PILOTs are frequently raised as a potential avenue for more revenue, as some communities have negotiated substantially higher amounts."
              badges={<Badge kind="confirmed">budget book</Badge>}
              amount="no change" amountTone="muted"
            />
            <LineRow
              label="Abatement reserve (reduces available levy)"
              desc={<>Every year state law requires Beverly to hold back a portion of the levy as a buffer, covering cases where a property owner challenges their bill and wins a reduction. Beverly held back $500K this year. Any leftover is freed up later.{fn(2)}</>}
              badges={<Badge kind="confirmed">budget book</Badge>}
              amount="-$500K" amountTone="cost" pct="reduces total by 7%" bar={{ pct: 7, tone: "cost" }}
            />
          </GroupBlock>

          <GroupBlock name="State funding" pct="10% of revenue growth" total="+$719K" tone="rev">
            <LineRow
              label="Chapter 70 school funding from the state"
              desc="The state distributes education funding through a formula called Chapter 70. Beverly receives the minimum aid level, meaning the formula calculates that Beverly's local tax capacity is high enough to qualify for a lower state contribution than many communities. The allocation grew $714K this year, but the city remains in the minimum tier."
              badges={<Badge kind="confirmed">budget book</Badge>}
              amount="+$714K" amountTone="rev" pct="10% of revenue growth" bar={{ pct: 10, tone: "rev" }}
            />
            <LineRow
              label="Unrestricted General Government Aid (UGGA)"
              desc={<>The state&apos;s annual general aid for non-school operations. Beverly&apos;s allocation fell $24K this year. UGGA has no formula accounting for a city&apos;s current population, needs, or economy. It was created in 2010 by merging two older programs, and each city&apos;s share is essentially frozen to what it received then, adjusted a little each year. Beverly&apos;s aid reflects a snapshot from over a decade ago. The Massachusetts Municipal Association has pushed for a new formula.{fn(3)}</>}
              badges={<Badge kind="confirmed">budget book</Badge>}
              amount="-$24K" amountTone="cost" pct="reduces total slightly"
            />
            <LineRow
              label="Other state aid (net)"
              desc="Veterans reimbursement fell $105K (25%). Charter school reimbursement +$38K, smart growth payment +$158K. Net: approximately +$29K across all other state aid lines."
              badges={<Badge kind="derived">calculated from budget totals</Badge>}
              amount="+$29K" amountTone="rev"
            />
          </GroupBlock>

          <GroupBlock name="National Grid energy credit" pct="passthrough" total="+$700K" tone="pass">
            <LineRow
              label="National Grid energy savings credit"
              desc={<>National Grid reimbursed Beverly about $700K for energy savings through the Electric Division. This appears as revenue; a corresponding cost increase appears in Part 2 under Public Services. The two largely offset. Note that this $700K is included in both the $7.2M revenue growth and the $10M cost growth figures, so both headline numbers are inflated slightly by an item that nets close to zero.{fn(10)}</>}
              badges={<><Badge kind="passthrough">passthrough: see Part 2</Badge><Badge kind="confirmed">budget book</Badge></>}
              amount="+$700K" amountTone="pass" pct="10% of revenue total" bar={{ pct: 10, tone: "pass" }}
            />
          </GroupBlock>

          <GroupBlock name="Other sources" pct="1% of revenue growth" total="+$72K net" tone="rev">
            <LineRow
              label="Enterprise fund transfers and other financing"
              desc="Water, sewer, airport, and other services that run like self-contained businesses (enterprise funds, each meant to cover its own costs through fees) contribute to shared overhead. Part 3 returns to this, because trash is one of these funds and the general fund's contribution to it is the heart of the trash fee story."
              badges={<Badge kind="derived">calculated from budget totals</Badge>}
              amount="+$147K" amountTone="rev"
            />
            <LineRow
              label="Investment income on city funds"
              desc="Interest earned on city accounts. Down $75K this year."
              badges={<Badge kind="confirmed">budget book</Badge>}
              amount="-$75K" amountTone="cost"
            />
          </GroupBlock>

          <Critical>
            The property tax cap lets the city raise only about two and a half percent more each year, well short of what costs are
            climbing. Closing that gap means some mix of three things: residents paying more, the city cutting what it provides, or someone
            else contributing more, meaning the state or large tax-exempt institutions. Most people would rather the last group went first.
            How much of the gap do you honestly think can be closed by someone other than Beverly residents, and what happens if the answer
            is not enough?
          </Critical>
        </PhaseSection>

        {/* ===== PART 2: COSTS ===== */}
        <PhaseSection n={2} title="Where the money goes">
          <Narrative>
            This section walks through what Beverly spends money on and what drove the increases this year. Most of the growth comes from
            contracts, legal requirements, and formulas set before the annual budget process even starts. Part 3 and Part 4 are where the
            city&apos;s choices come in. This section is just the bills going up.
          </Narrative>
          <Topline tone="cost" number="+$10.0M">
            <strong>Total cost growth this year</strong>
            <br />
            Education alone accounts for about half. Each category shows its share of the total.
          </Topline>

          <GroupBlock name="Education" pct="52% of cost growth" total="-$5.19M" tone="cost">
            <LineRow
              label="Beverly Public Schools"
              desc="Up 5.28%, bringing the city's contribution to $89.9 million. Schools now account for 49.7% of the entire city budget. On top of that, Beverly pays $1.52M in tuition for residents who enroll in charter schools or another district, part of what brings total education spending to 53.1% of the budget. For comparison, the school budget rose 7.73% in FY25 and 9.08% in FY26. The rate has slowed but the base keeps compounding."
              badges={<Badge kind="confirmed">budget book + transmittal letter</Badge>}
              amount="-$4.50M" amountTone="cost" pct="45% of cost growth" bar={{ pct: 45, tone: "cost" }}
            />
            <Callout tone="cost" label="The education funding tension">
              Even with this increase, Beverly Public Schools has acknowledged unmet needs, particularly in special education. The school
              budget is rising, and it is still not enough by the district&apos;s own account. Both sides of that picture are true at the
              same time.
            </Callout>
            <LineRow
              label="Essex Tech (North Shore Agricultural and Technical School)"
              desc={<>Beverly is one of 17 member communities that support Essex Tech. The city&apos;s annual payment is set by a formula in the school&apos;s founding legislation: costs are split based on how many Beverly students attend relative to other towns.{fn(4)}{" "}Beverly does not control the school&apos;s per-student costs or how many Beverly students apply. This year&apos;s assessment rose 17.4%, adding $690K.</>}
              badges={<Badge kind="confirmed">budget book + transmittal letter</Badge>}
              amount="-$690K" amountTone="cost" pct="7% of cost growth" bar={{ pct: 15, tone: "cost" }}
            />
          </GroupBlock>

          <GroupBlock name="Employee benefits" pct="18% of cost growth" total="-$1.76M" tone="cost">
            <LineRow
              label="Health insurance for city and school employees"
              desc="Up 9% this year (+$1.09M). The annual premium increase is set by the city's health plan, not by the city's own negotiating table."
              badges={<Badge kind="confirmed">budget book</Badge>}
              amount="-$1.09M" amountTone="cost" pct="11% of cost growth" bar={{ pct: 24, tone: "cost" }}
            />
            <LineRow
              label="Pension contributions to Essex County Retirement System"
              desc="Up 4.7% (+$669K). The annual contribution is set by an independent actuarial review of the pension fund. Beverly cannot unilaterally reduce or defer this payment."
              badges={<Badge kind="confirmed">budget book</Badge>}
              amount="-$669K" amountTone="cost" pct="7% of cost growth" bar={{ pct: 15, tone: "cost" }}
            />
          </GroupBlock>

          <GroupBlock name="Public services and infrastructure" pct="12% of cost growth" total="-$1.25M" tone="cost">
            <LineRow
              label="Electric Division"
              desc="Electric costs rose about $588K this year. Nearly all is tied to National Grid, which also reimburses Beverly about $700K through the energy savings credit shown in Part 1. Because the credit and the cost sit on opposite sides of the budget, this line is close to a wash overall."
              badges={<><Badge kind="passthrough">credit shown in Part 1</Badge><Badge kind="confirmed">budget book</Badge></>}
              amount="-$588K" amountTone="cost" pct={<>6% of cost growth<br /><span style={{ color: PASS, fontSize: 10 }}>offset by credit in Part 1</span></>} bar={{ pct: 13, tone: "pass" }}
            />
            <LineRow
              label="Engineering, Highway, Parks, DPS operations (excluding electric)"
              desc="Fuel, materials, and staffing costs drove increases across these departments."
              badges={<Badge kind="confirmed">budget book</Badge>}
              amount="-$665K" amountTone="cost" pct="7% of cost growth" bar={{ pct: 15, tone: "cost" }}
            />
          </GroupBlock>

          <GroupBlock name="Public safety" pct="10% of cost growth" total="-$986K" tone="cost">
            <LineRow
              label="Police, Fire, Dispatch, Harbormaster"
              desc="Wage increases are driven by collective bargaining contracts. The transmittal letter notes Police and Fire are each holding one position open through attrition this year, meaning a vacant position is not refilled. This partially reduces the contractual cost growth."
              badges={<Badge kind="confirmed">budget book + transmittal letter</Badge>}
              amount="-$986K" amountTone="cost" pct="10% of cost growth" bar={{ pct: 22, tone: "cost" }}
            />
          </GroupBlock>

          <GroupBlock name="Required contributions and other obligations" pct="8% of cost growth" total="-$861K" tone="cost">
            <LineRow
              label="Payroll taxes (Social Security and Medicare) and OPEB fund"
              desc="Payroll taxes: Beverly's share of Social Security and Medicare on employee wages, set by federal law. OPEB fund: money set aside today toward future retirees' health insurance, required by state law."
              badges={<Badge kind="confirmed">budget book</Badge>}
              amount="-$667K" amountTone="cost" pct="7% of cost growth" bar={{ pct: 15, tone: "cost" }}
            />
            <LineRow
              label="McPherson Youth Center: deliberate budget increase"
              desc="The McPherson Youth Center on Rantoul Street received a deliberate 70% budget increase this year, from $68K to $117K (+$48K). This represents a policy decision to expand programming."
              badges={<Badge kind="confirmed">budget book</Badge>}
              amount="-$48K" amountTone="cost"
            />
            <LineRow
              label="Debt service on existing loans"
              desc={<>Only roughly +$176K this year, an unusually small increase given that the City Hall renovation loan payments have started.{fn(5)}{" "}Beverly&apos;s debt service historically runs near 5-7% of the total budget. At 5.01% in FY27 it is at the low end of that range. The reason debt payments barely moved is explained in the callout below.</>}
              badges={<Badge kind="confirmed">budget book + City Hall presentation, slide 27</Badge>}
              amount="-~$176K" amountTone="cost" pct="2% of cost growth" bar={{ pct: 4, tone: "cost" }}
            />
          </GroupBlock>

          {/* City Hall box */}
          <div className="my-7 border-2 px-5 py-5 sm:px-6" style={{ borderColor: "var(--color-gold)", background: tint("var(--color-gold)", 8) }}>
            <div className="text-[0.6875rem] font-bold uppercase tracking-widest text-gold-strong">A closer look: the City Hall renovation and the debt budget</div>
            <div className="mt-1.5 font-display text-xl font-semibold text-ink">A $29.4M project that added only $176K to this year&apos;s debt payments</div>
            {[
              { l: "Start with the number that actually matters", b: <>The City Hall renovation is the loudest fight in town, and the number that headlines it is the big one: $29.4M. But that is the sticker price on the whole project, spread over decades of loan payments. It is not what hit this year&apos;s budget. What hit this year&apos;s budget is the annual payment, and that went up by about $176K. The rest of this section is about why a $29.4M project moved the yearly number so little. The short version is timing.</> },
              { l: "Think of it like buying a car", b: <>Picture a household with a Subaru Forester at 200,000 miles. It runs, but every inspection is a coin flip. There is no car payment anymore, but there is a home improvement loan still on the books from when they redid the kitchen. So they wait, and they plan. They shop with a number in mind: whatever the new car costs, the monthly payment should land right about where the kitchen payment leaves off. When the kitchen loan is nearly done, they pick a car and a loan built to fit that number, and they sign. Their total monthly outlay barely changes, because one payment ended right as the other began. That is what Beverly did with City Hall.</> },
              { l: "How the project is being paid for", b: <>The full cost is $29.4M: $28.4M for the work, $1M to relocate departments during construction. Beverly is not borrowing all of it. It put in $1.5M already set aside for design, moved $2M from a savings fund built for exactly this kind of capital need, and made a one-time $525K payment in the FY26 budget. That leaves about $25.4M to borrow, split into two loans that start at different times as the construction bills come due.</> },
            ].map((s) => (
              <div key={s.l} className="mt-3.5 border-b border-black/10 pb-3.5">
                <div className="mb-1 text-[0.6875rem] font-bold uppercase tracking-wider text-gold-strong">{s.l}</div>
                <p className="text-[0.90625rem] leading-relaxed text-ink-mid">{s.b}</p>
              </div>
            ))}
            <div className="mt-3.5 border-b border-black/10 pb-3.5">
              <div className="mb-1 text-[0.6875rem] font-bold uppercase tracking-wider text-gold-strong">Why the FY27 payment is only $2M, and why total debt service barely rose</div>
              <p className="text-[0.90625rem] leading-relaxed text-ink-mid">
                Only the first loan starts in FY27. The second ($10M) does not begin until FY28. And just like the kitchen loan coming off
                the books, two older loans made their final payments in FY26 and left the schedule entirely, opening up room right as City
                Hall stepped in. Here is the math:
              </p>
              <div className="mt-3 max-w-[440px] rounded-md border border-rule bg-bg px-4 py-3 text-[0.8125rem] tabular-nums">
                {[
                  ["City Hall loan 1 begins", "+$2,000,000", "cost"],
                  ["FY26 one-time pre-payment ends", "-$525,000", "rev"],
                  ["Land acquisition bond retires", "-$1,000,000", "rev"],
                  ["Fire Station loan retires", "-$293,000", "rev"],
                  ["Existing bonds naturally decline", "-$206,000", "rev"],
                  ["Short-term borrowing change", "+$200,000", "cost"],
                ].map(([k, v, t]) => (
                  <div key={k} className="flex items-baseline justify-between gap-4 py-0.5">
                    <span className="text-ink-mid">{k}</span>
                    <span style={{ color: TONE[t] }}>{v}</span>
                  </div>
                ))}
                <div className="mt-1 flex items-baseline justify-between gap-4 border-t border-rule pt-1.5 font-semibold">
                  <span className="text-ink">Net change in total debt service</span>
                  <span style={{ color: "var(--color-gold-strong)" }}>+$176,000</span>
                </div>
              </div>
            </div>
            <div className="mt-3.5 border-b border-black/10 pb-3.5">
              <div className="mb-1 text-[0.6875rem] font-bold uppercase tracking-wider text-gold-strong">What happens next</div>
              <p className="text-[0.90625rem] leading-relaxed text-ink-mid">
                FY28 is when both loans run at once, adding about $2.4M in City Hall payments. The rest of the portfolio keeps shrinking,
                which absorbs much of that. Debt service is projected to hold near 5% of the budget through FY2032. Two ways to read that.
                Level: 5% sits at the bottom of the 5-7% range Beverly has run for decades. Direction: the state treats debt as a fiscal
                stress problem when payments grow to the point of crowding out everyday services.{fn(11)}{" "}None of Beverly&apos;s neighbors
                shows that kind of stress, but Massachusetts has a live example: Quincy. Quincy&apos;s own breakdown puts debt service at
                19.54% of its FY26 budget, nearly four times Beverly&apos;s share, swollen partly by borrowing against its pension
                obligations. Both major rating agencies have downgraded it. Per resident, Quincy spends about $882 a year on debt payments;
                Beverly spends about $212. A full year-by-year breakdown is in the <a href="#debt" className="text-gold-strong underline">appendix</a>.
              </p>
            </div>
            <div className="mt-3.5">
              <div className="mb-1 text-[0.6875rem] font-bold uppercase tracking-wider text-gold-strong">The broader strategy</div>
              <p className="text-[0.90625rem] leading-relaxed text-ink-mid">
                This is not a one-off trick. Beverly has borrowed this way since the mid-1990s, timing new loans to start as old ones end so
                the yearly total stays roughly flat against the budget. City Hall is the newest project run through that playbook. The
                January 2026 presentation to the City Council lays it out directly, with charts showing the loans stacking and clearing
                over time.{fn(9)}
              </p>
            </div>
          </div>

          <Critical>
            The sharpest version of the skeptic&apos;s case isn&apos;t about City Hall at all. It&apos;s that the city is borrowing for a
            building while schools go underfunded and services get cut. That&apos;s a real feeling and it deserves a real answer. The honest
            reply is that the yearly cost of this project is small and steady, and Beverly&apos;s debt payments are holding flat against the
            budget rather than climbing, which is the opposite of the pattern the state flags as fiscal stress. So the question isn&apos;t
            really whether City Hall is worth it. It&apos;s whether Beverly should borrow for big long-lived things at all. Because the next
            bond won&apos;t be for a city hall. It might be a new school, or the roof over a branch library. If borrowing is reckless here,
            it&apos;s reckless for those too. If it&apos;s responsible for those, what makes this different, beyond that a government
            building is easier to resent?
          </Critical>
        </PhaseSection>

        {/* ===== PART 3: TRASH ===== */}
        <PhaseSection n={3} title="The trash fee: a choice between two kinds of burden">
          <Narrative>
            After accounting for all revenue and cost changes, Beverly faced a roughly <b>$2.88 million gap</b>{" "}to close. The city had two
            main levers: ask residents to pay more directly through trash fees, or make deeper cuts to services and staffing. The trash fee
            was the one lever the City Council could pull on its own, without waiting on the state legislature, negotiating with outside
            institutions, or putting a question to voters. Three realistic options were on the table.
          </Narrative>
          <Callout tone="pass" label="How trash is funded in Beverly">
            Trash and recycling run as a separate city account that has to break even each year. Picture an apartment building. One unit has
            two roommates. Their electric bill is $500, but each roommate pays only $100, leaving $300 unpaid. The landlord covers that $300
            out of the rent he collects across the whole building. Every dollar spent covering that one unit&apos;s shortfall is a dollar he
            cannot spend on the building or staff. Beverly runs several of these accounts, called enterprise funds, and trash is the odd one
            out. Water and sewer are enterprise funds too, and fees cover more than 90% of their cost.{fn(12)}{" "}Trash was the exception.
            Residents paid $100 per year, the real cost was far higher, and the general fund (the same pot that pays for schools, police, and
            roads) covered the $2.48M shortfall. This year the new hauler contract alone jumped $1.3M. Either way, the cost reaches every
            resident, homeowners on the tax bill and, indirectly, renters through what landlords charge.
          </Callout>
          <Callout tone="pass" label="The baseline that ties it all together">
            Last year the general fund covered $2.48M of the trash program&apos;s cost. That is the number to keep in mind. Each option below
            changes how much the general fund has to chip in this year, and that change flows straight into the budget. Higher fee, less the
            general fund covers, fewer services cut. Follow each card top to bottom to see how the fee choice turns into a cut requirement.
          </Callout>

          <div className="my-6 grid gap-3 sm:grid-cols-3">
            <OptionCard
              eyebrow="Option A" title="Keep fees at $100/year"
              desc={<>No change to residents&apos; trash bills. Some council members argued for this approach or for fees lower than what was adopted.{fn(6)}</>}
              chain={[["Cost to run sanitation", "$5.27M", ""], ["Resident fees (at $100)", "-$1.27M", "rev"], ["Other fund income", "-$0.20M", "rev"]]}
              pivot={["General fund must cover the rest", "$3.80M"]}
              bridge={<>That is <b>$1.32M more</b>{" "}than last year&apos;s $2.48M subsidy. The extra cost pushes the deficit up.</>}
              outcome={{ key: "Deficit remaining for cuts", val: "~$4.2M", tone: "ink", sub: "Fee covers 0% of the gap. Deepest cuts of the three." }}
            />
            <OptionCard
              eyebrow="Option B: Mayor's prior proposal" title="Raise to $425 standard bin"
              desc={<>Per Patch reporting on the fee vote,{fn(7)}{" "}the mayor&apos;s prior proposal was $425 for a standard bin, $280 for a smaller bin.</>}
              chain={[["Cost to run sanitation", "$5.27M", ""], ["Resident fees (at $425)", "-$5.21M", "rev"], ["Other fund income", "-$0.20M", "rev"]]}
              pivot={["General fund must cover the rest", "~$0"]}
              bridge={<>That is <b>$2.48M less</b>{" "}than last year&apos;s subsidy. Nearly the entire deficit is erased.</>}
              outcome={{ key: "Deficit remaining for cuts", val: "~$407K", tone: "ink", sub: "Fee covers about 86% of the gap. Shallowest cuts, highest bills." }}
            />
            <OptionCard
              adopted eyebrow="Option C: Council vote" title="Raise to $300 standard bin"
              badge={<>Adopted 7-2{fn(7)}</>}
              desc="$200 (35-gal), $300 (standard), $400 (95-gal), $650 (commercial). More than before, less than the mayor proposed."
              chain={[["Cost to run sanitation", "$5.27M", ""], ["Resident fees (at $300)", "-$3.68M", "rev"], ["Other fund income", "-$0.20M", "rev"]]}
              pivot={["General fund must cover the rest", "$1.40M"]}
              bridge={<>That is <b>$1.08M less</b>{" "}than last year&apos;s subsidy. The deficit shrinks, but does not close.</>}
              outcome={{ key: "Deficit remaining for cuts", val: "~$1.81M", tone: "cuts", sub: "Fee covers about 37% of the gap. The middle path the Council chose." }}
            />
          </div>
          <p className="mb-6 text-[0.78125rem] text-ink-faint">
            Each option starts from the same $5.27M sanitation cost and the same $2.88M pre-trash deficit. The only variable is the fee
            level, which sets the general fund contribution, which sets how much is left to close through cuts in Part 4.
          </p>

          <div className="mb-1.5 mt-6 text-[0.6875rem] font-semibold uppercase tracking-widest text-ink-faint">What the adopted schedule means in numbers</div>
          <div className="grid gap-px overflow-hidden rounded-md border border-rule bg-rule sm:grid-cols-3">
            {[
              { k: "Total sanitation program cost", v: "$5.27M", vt: "cost", sub: "up from $3.93M last year (+$1.35M, +34%)", note: "Hauler contract up $1.30M. Recycling processing up $492K. Incineration savings of $457K partially offset." },
              { k: "Total fee revenue collected", v: "$3.68M", vt: "rev", sub: "up from $1.27M last year (+$2.41M, +190%)", note: "At the adopted schedule, residents pay about three times more in fees than under the $100 flat rate." },
              { k: "Remaining general fund contribution", v: "$1.40M", vt: "trash", sub: "down from $2.48M last year (-$1.08M)", note: "The general fund saves $1.08M on sanitation this year, but still contributes $1.40M, part of the gap Part 4 closes through cuts.", hi: true },
            ].map((c) => (
              <div key={c.k} className="px-4 py-4" style={{ background: c.hi ? tint("var(--color-gold)", 10) : "var(--color-bg)" }}>
                <div className="text-[0.6875rem] font-semibold uppercase tracking-wider text-ink-faint">{c.k}</div>
                <div className="mt-1.5 text-lg font-bold tabular-nums" style={{ color: TONE[c.vt] }}>{c.v}</div>
                <div className="mt-0.5 text-[0.71875rem]" style={{ color: TONE[c.vt] }}>{c.sub}</div>
                <div className="mt-1.5 text-[0.78125rem] leading-relaxed text-ink-mid">{c.note}</div>
              </div>
            ))}
          </div>

          <Critical>
            There&apos;s no version where everyone pays less and keeps everything. The trash fee makes that concrete. Holding the fee at
            $100 instead of $300 doesn&apos;t lower the cost of collecting the trash. It shifts about $2.4 million onto the general fund,
            which has to come from somewhere else. That&apos;s more than the discretionary line items can cover, so the math eventually
            reaches the things most people want to protect: schools, public safety, public works. Worth asking where you&apos;d find it, and
            whether that changes how the fee looks.
          </Critical>
        </PhaseSection>

        {/* ===== PART 4: CUTS ===== */}
        <PhaseSection n={4} title="What gets reduced or eliminated">
          <Narrative>
            After the trash fee offset, Beverly still needed to close a $1.81 million gap. The mayor&apos;s proposed budget included cuts
            across staffing, services, and reserves. The City Council reviewed the budget on June 23, 2026, and added four further
            reductions totaling $93,120 on top of the mayor&apos;s proposal. Council members noted it was the largest dollar amount of cuts
            ever introduced by the Council in a final budget session, which speaks as much to the pattern of minimal amendment activity in
            prior years as to the scale of this year&apos;s cuts. The final budget passed 5-4.{fn(8)}
          </Narrative>

          <GroupBlock name="Capital funding and financial buffers" pct="39% of total reductions" total="+$711K" tone="cuts">
            <LineRow
              label="Capital projects fund: zeroed out"
              desc="In most years Beverly sets aside surplus cash for one-time needs: replacing aging equipment, emergency building repairs, road work outside normal maintenance. This year that pot was eliminated. Those needs do not disappear; they get deferred."
              badges={<Badge kind="confirmed">budget book</Badge>}
              amount="+$525K" amountTone="cuts" pct="29% of reductions" bar={{ pct: 29, tone: "cuts" }}
            />
            <ImpactBox>Equipment that breaks this year may not be replaced on a normal timeline. Road or building repairs that would have come from this fund get pushed to a future budget, often at higher cost.</ImpactBox>
            <LineRow
              label="Reserve for Appropriation: reduced by $186K"
              desc="The mayor's budget reduced this reserve from $1.1M to $915K. It is a pool set aside at the start of the year for unexpected mid-year costs: a storm blowing through the snow-removal budget, a legal settlement, equipment failing early. Beverly keeps two mid-year buffers; this is the larger operational one. Budget Analyst Gerald Perry cautioned on June 23 that these funds are essential for situations like snowstorm overtime, and cannot be replenished from free cash until year-end certification."
              badges={<Badge kind="confirmed">budget book + CC meeting notes</Badge>}
              amount="+$186K" amountTone="cuts" pct="10% of reductions" bar={{ pct: 35, tone: "cuts" }}
            />
            <ImpactBox>Less cushion if something unexpected costs more than expected mid-year. If the emergency fund runs out, additional cuts may be needed before the fiscal year ends.</ImpactBox>
          </GroupBlock>

          <GroupBlock name="City services" pct="23% of total reductions" total="+$427K" tone="cuts">
            <LineRow
              label="City bus (CATA shuttle): discontinued"
              desc="Beverly's municipal bus service ran on a contract with the Cape Ann Transportation Authority. The contract was not renewed. This was the largest single service cut in Part 4."
              badges={<Badge kind="confirmed">budget book + transmittal letter</Badge>}
              amount="+$185K" amountTone="cuts" pct="10% of reductions" bar={{ pct: 35, tone: "cuts" }}
            />
            <ImpactBox>Residents without cars who used the bus for work, appointments, or shopping have no direct replacement from the city. A Council on Aging transportation program exists but requires eligibility and runs different routes.</ImpactBox>
            <LineRow
              label="Library, Council on Aging, Health Dept, Veterans Services (combined)"
              desc="Beverly Farms library branch: reduced hours. Council on Aging: one part-time position eliminated. Health Dept dental clinic: grant-funded for FY27, removing it from the city budget for now, but the grant must be renewed annually. Veterans services reduced."
              badges={<Badge kind="confirmed">transmittal letter</Badge>}
              amount="+$220K" amountTone="cuts" pct="12% of reductions" bar={{ pct: 42, tone: "cuts" }}
            />
            <ImpactBox>Fewer library hours in Beverly Farms. Less COA capacity. Dental care access for lower-income residents now depends on a grant that may not be renewed in future years.</ImpactBox>
            <LineRow
              label="Planning department: one staff position eliminated, consulting reduced"
              desc="One full-time position eliminated. Consulting and outside services reduced. The $185K shuttle bus contract shown above was also part of the Planning budget."
              badges={<Badge kind="confirmed">transmittal letter</Badge>}
              amount="+$22K" amountTone="cuts"
            />
            <ImpactBox>Less capacity for permit review, zoning analysis, and grant writing.</ImpactBox>
          </GroupBlock>

          <GroupBlock name="Staffing and administration (mayor's proposal + council additions)" pct="18% of total reductions" total="+$334K" tone="cuts">
            <LineRow
              label="Mayor's office: 2.5 positions reduced"
              desc="Two and a half positions were eliminated. One was the Assistant Sustainability Director, whose role is funded for FY27 and FY28 by a private donor; when that donation ends, the city would need to find funding to continue it. Two nonprofit contracts were also ended: $35K for downtown initiatives and $15K for economic stimulus work."
              badges={<Badge kind="confirmed">transmittal letter</Badge>}
              amount="+$155K" amountTone="cuts" pct="8% of reductions" bar={{ pct: 29, tone: "cuts" }}
            />
            <AmendBox label="Additional cuts added on top of the above by the City Council on June 23">
              <AmendItem name="Mayor's office expenses (line 51892)" change="$13,500 → $10,000" saves="saves $3,500" vote="vote 9-0" />
              <AmendItem name="Racial Justice staff position" change="$62,620 → $0" saves="saves $62,620" vote="vote 5-4" />
            </AmendBox>
            <ImpactBox>Reduced mayoral office capacity. Downtown and economic stimulus partnerships ended. Racial Justice staff work eliminated after a narrow council vote. Sustainability work continues for now under private funding.</ImpactBox>
            <LineRow
              label="Finance department: Budget Analyst position reduced"
              desc="Originally proposed by the mayor. The City Council added a further reduction on June 23."
              badges={<Badge kind="confirmed">transmittal letter + CC meeting notes</Badge>}
              amount="+$20K" amountTone="cuts"
            />
            <AmendBox label="Cut introduced by the City Council on June 23 (not in the mayor's original proposal)">
              <AmendItem name="Budget Analyst salary (per diem, est. half of Finance Director salary)" change="$79,870 → $59,870" saves="saves $20,000" vote="vote 9-0" />
            </AmendBox>
            <LineRow
              label="Purchasing / Mail Messenger: position zeroed out"
              desc="Added by City Council on June 23. Voted 5-4."
              badges={<><Badge kind="amendment">council addition</Badge><Badge kind="confirmed">CC meeting notes</Badge></>}
              amount="+$7K" amountTone="cuts"
            />
            <AmendBox label="Cut introduced by the City Council on June 23 (not in the mayor's original proposal)">
              <AmendItem name="Mail Messenger position" change="$7,000 → $0" saves="saves $7,000" vote="vote 5-4" />
            </AmendBox>
            <LineRow
              label="Inspections (-$70K), HR (-$35K), Solicitor (-$16K), Council and Clerk offices (-$31K)"
              desc="Reductions across several administrative departments through attrition and eliminated positions. Inspectional Services lost 1.5 positions. Finance lost 2 positions to attrition."
              badges={<Badge kind="confirmed">budget book + transmittal letter</Badge>}
              amount="+$152K" amountTone="cuts" pct="8% of reductions" bar={{ pct: 29, tone: "cuts" }}
            />
            <ImpactBox>Building inspections and permit reviews may take longer. Less administrative capacity across the city.</ImpactBox>
          </GroupBlock>

          <GroupBlock name="Departmental budget tightening" pct="20% of total reductions" total="+$361K" tone="cuts">
            <LineRow
              label="Workers compensation reserve: reduced $80K"
              desc="A calculated risk that workers compensation claims will remain within a lower ceiling this year."
              badges={<Badge kind="confirmed">budget book</Badge>}
              amount="+$80K" amountTone="cuts"
            />
            <LineRow
              label="Consulting budgets, conference travel, surveys, and departmental supplies"
              desc="Departments across the city are running leaner on discretionary spending: reduced conference travel, fewer outside studies, tighter supply budgets."
              badges={<Badge kind="derived">estimated from budget constraints</Badge>}
              amount="+$281K" amountTone="cuts" pct="15% of reductions" bar={{ pct: 53, tone: "cuts" }}
            />
            <ImpactBox>Departments have less capacity for outside expertise, property appraisals, and professional development for staff.</ImpactBox>
          </GroupBlock>

          <Critical>
            Balancing this year took real work, and it used up the moves that were available. The gap comes back next year, larger. Getting
            out of the pattern means one of a few hard things, each with a catch. An override, which raises everyone&apos;s taxes and can
            lose at the ballot. More from the state or from large tax-exempt institutions, which Beverly has to fight for and can&apos;t
            simply decide. Or not building, and not just City Hall but any major project that needs that kind of money, while the buildings
            the city already owns get more expensive to fix the longer they wait. None is free and none is guaranteed. Which would you
            actually push for? Because doing none of them is choosing this same squeeze again next year.
          </Critical>
        </PhaseSection>

        {/* closing */}
        <section id="next-year" className="scroll-mt-[132px] border-b border-rule py-12 sm:py-14">
          <div className="mb-2 flex items-center gap-2 text-[0.6875rem] font-bold uppercase tracking-[0.18em] text-ink">
            <span className="inline-block h-[3px] w-[18px] bg-ink" />
            What happens next
          </div>
          <h2 className="font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            This year is balanced. The problem is not solved.
          </h2>
          <Narrative>
            Everything in this piece describes how Beverly closed the gap for one year. The gap itself does not go away. The same forces that
            opened it, costs climbing faster than the property tax cap allows, are still in place, and several of the moves used this year
            were one-time fixes that cannot be repeated. A private donor is covering a position for two years. A dental clinic shifted onto a
            grant that has to be renewed. Reserves were drawn down; the mayor noted the city has spent roughly $2 million from its rainy-day
            fund.
          </Narrative>
          <Narrative>
            At the June 23 budget meeting, Councilor Scott Houseman raised the kinds of moves FY2028 might force onto the table if the
            trajectory holds: raising kindergarten fees, cutting the school budget, bringing the city&apos;s share of health insurance below
            80%, cautioning unions that raises above the 2.5% the tax cap allows may not be affordable, and leaning on the state for more aid.
            He was not endorsing these as a platform. He was naming them as the uncomfortable levers a city reaches for when the easy ones
            are gone, and he called it a &quot;break glass&quot; moment.{fn(8)}{" "}The specific list matters less than the direction it points.
            This was not the hard year. Next year is harder.
          </Narrative>
          <Narrative>
            If you want the structural squeeze underneath all of this, or where residents can weigh in before the next budget, the{" "}
            <A href="/work/beverly/budget-explainer">earlier explainer</A> covers both. What the decade of choices underneath this year
            says about the town is the subject of a companion piece, coming soon. This piece has stuck to the mechanics of how the money
            moved, not the politics of the moment.
          </Narrative>
        </section>

        {/* appendix */}
        <section id="debt" className="scroll-mt-[132px] border-b border-rule py-12">
          <h2 className="font-display text-2xl font-semibold">Appendix: Beverly&apos;s annual loan payments, FY2026 through FY2033</h2>
          <p className="mt-2 max-w-[68ch] text-[0.875rem] leading-relaxed text-ink-mid">
            Beverly borrows for large capital projects and repays through annual payments in the operating budget. The table shows how those
            payments are projected to look, based on the General Fund Debt Schedule presented to the City Council in January 2026. FY2026 and
            FY2027 reflect actual budget figures. FY2028 reflects an authorized loan not yet issued. Everything from FY2029 onward is a
            projection based on capital projects Beverly was planning as of January 2026, many not yet formally authorized; if they do not
            proceed, those years would be lower.
          </p>
          <p className="mt-3 max-w-[68ch] text-[0.875rem] leading-relaxed text-ink-mid">
            The large jump in FY2033 is driven primarily by a proposed $50 million Public Services Building that appears as a planning entry
            in the January 2026 schedule. No additional details on the status of that project have been confirmed. If it does not move
            forward, the FY2033 figure would be substantially lower.
          </p>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full border-collapse text-[0.78125rem] tabular-nums">
              <thead>
                <tr className="border-b-2 border-ink text-ink-faint">
                  {["Year", "Existing bonds", "City Hall loan 1", "City Hall loan 2", "Other projected", "Total", "% of budget"].map((h, i) => (
                    <th key={h} className={`px-2.5 py-2 text-[0.6875rem] font-semibold uppercase tracking-wide ${i === 0 ? "text-left" : "text-right"}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DEBT_ROWS.map((r) => (
                  <tr key={r.y} className="border-b border-rule" style={{ background: r.now ? tint("var(--color-cuts)", 10) : r.hi ? tint("var(--color-gold)", 12) : undefined, color: r.proj ? "var(--color-ink-faint)" : undefined }}>
                    <td className={`px-2.5 py-2 text-left ${r.bold ? "font-semibold text-ink" : ""}`}>{r.y}</td>
                    <td className="px-2.5 py-2 text-right">{r.ex}</td>
                    <td className="px-2.5 py-2 text-right">{r.l1}</td>
                    <td className="px-2.5 py-2 text-right">{r.l2}</td>
                    <td className="px-2.5 py-2 text-right">{r.other}</td>
                    <td className={`px-2.5 py-2 text-right ${r.bold ? "font-semibold text-ink" : ""}`}>{r.total}</td>
                    <td className={`px-2.5 py-2 text-right ${r.bold ? "font-semibold text-ink" : ""}`}>{r.pct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 max-w-[68ch] text-[0.78125rem] leading-relaxed text-ink-faint">
            Source: City of Beverly General Fund Debt Schedule, City Council presentation, January 20, 2026, slide 27. &quot;% of budget&quot;
            figures are the presentation&apos;s own projections of debt service as a share of the estimated general fund. FY2029+ figures are
            conditional on planned capital projects proceeding.
          </p>
        </section>

        {/* footnotes */}
        <section className="py-10">
          <h3 className="text-[0.6875rem] font-bold uppercase tracking-widest text-ink-faint">Notes referenced in the text</h3>
          <ol className="mt-4 space-y-2.5 text-[0.8125rem] leading-relaxed text-ink-mid">
            {NOTES.map((note, i) => (
              <li key={i} id={`fn-${i + 1}`} className="grid grid-cols-[1.6rem_1fr] gap-1 scroll-mt-[132px]">
                <a href={`#fnref-${i + 1}`} className="tabular-nums text-ink-faint no-underline hover:text-ink">[{i + 1}]</a>
                <span className="max-w-[72ch]">{note}</span>
              </li>
            ))}
          </ol>
          <h3 className="mt-9 text-[0.6875rem] font-bold uppercase tracking-widest text-ink-faint">Core source documents</h3>
          <p className="mt-3 max-w-[74ch] text-[0.8125rem] leading-relaxed text-ink-mid [&_b]:font-semibold [&_b]:text-ink">
            <b>City of Beverly documents:</b>{" "}FY2027 Operating Budget (June 1, 2026); Mayor Cahill budget transmittal letter (June 1, 2026);
            FY2026-2030 Financial Forecast;{" "}
            <ExtA href="https://www.youtube.com/watch?v=nlwByu273SM">City Council budget meeting, June 23, 2026</ExtA>;{" "}
            <ExtA href="https://www.beverlyma.gov/DocumentCenter/View/7054/Beverly-City-Hall-Renovation-and-Expansion--City-Council-Project-Update--January-20-2026?bidId=">
              Beverly City Hall Renovation and Expansion, City Council Project Update (January 20, 2026)
            </ExtA>
            .<br />
            <br />
            <b>News reporting:</b>{" "}Scott Souza, Patch,{" "}
            <ExtA href="https://patch.com/massachusetts/beverly/proposed-beverly-trash-fee-increase-spurs-fierce-city-council-debate">
              &quot;Proposed Beverly Trash Fee Increase Spurs Fierce City Council Debate&quot;
            </ExtA>{" "}
            (May 19, 2026) and{" "}
            <ExtA href="https://patch.com/massachusetts/beverly/beverly-mayor-outlines-staff-cuts-amid-budget-deficit-modified-trash-fee">
              &quot;Beverly Mayor Outlines Staff Cuts Amid Budget Deficit&quot;
            </ExtA>{" "}
            (June 2026); Will Dowd,{" "}
            <ExtA href="https://www.marbleheadindependent.com/marblehead-voters-approve-15m-override-ending-more-than-two-decades-of-resistance/">Marblehead Independent</ExtA>{" "}
            (June 9, 2026).
            <br />
            <br />
            <b>State law and data:</b>{" "}
            <ExtA href="https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter59/Section25">Massachusetts General Laws Chapter 59, Section 25</ExtA>{" "}
            (overlay reserve);{" "}
            <ExtA href="https://malegislature.gov/Laws/SessionLaws/Acts/2004/Chapter463">Acts of 2004, Chapter 463</ExtA> (Essex Tech assessment);{" "}
            <ExtA href="https://www.mass.gov/orgs/division-of-local-services">Mass.gov Division of Local Services</ExtA>;{" "}
            <ExtA href="https://www.bostonglobe.com/2025/12/18/opinion/ugga-municipal-aid-formula/">Boston Globe editorial on UGGA reform</ExtA>{" "}
            (December 2025).
          </p>
        </section>
      </div>
    </div>
  );
}

/* ---------- option card ---------- */
function OptionCard({
  eyebrow, title, desc, chain, pivot, bridge, outcome, adopted, badge,
}: {
  eyebrow: string; title: string; desc: React.ReactNode; chain: [string, string, string][]; pivot: [string, string];
  bridge: React.ReactNode; outcome: { key: string; val: string; tone: string; sub: string }; adopted?: boolean; badge?: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col rounded-md border bg-bg px-4 py-4" style={{ borderColor: adopted ? "var(--color-gold)" : "var(--color-rule)", borderWidth: adopted ? 2 : 1, borderTopWidth: 3, borderTopColor: adopted ? "var(--color-gold)" : "var(--color-rule)" }}>
      {badge && (
        <span className="absolute -top-px right-2.5 px-1.5 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-wide text-white" style={{ background: "var(--color-gold-strong)" }}>{badge}</span>
      )}
      <div className="text-[0.6875rem] font-semibold uppercase tracking-wider" style={{ color: adopted ? "var(--color-gold-strong)" : "var(--color-ink-faint)" }}>{eyebrow}</div>
      <div className="mt-1.5 text-[0.9375rem] font-semibold leading-snug text-ink">{title}</div>
      <div className="mt-2 flex-1 text-[0.8125rem] leading-relaxed text-ink-mid">{desc}</div>
      <div className="mt-3 text-[0.78125rem] tabular-nums">
        <div className="mb-1.5 text-[0.6875rem] font-semibold uppercase tracking-wider text-ink-faint">Step 1: the enterprise fund</div>
        {chain.map(([k, v, t]) => (
          <div key={k} className="flex justify-between gap-2 py-0.5">
            <span className="text-ink-mid">{k}</span>
            <span style={{ color: t ? TONE[t] : "var(--color-ink)" }}>{v}</span>
          </div>
        ))}
        <div className="mt-1 flex justify-between gap-2 border-t border-rule pt-1.5 font-semibold text-ink">
          <span>{pivot[0]}</span>
          <span>{pivot[1]}</span>
        </div>
      </div>
      <div className="my-2.5 border-l-2 border-ink-faint bg-bg-card/50 px-2.5 py-1.5 text-[0.71875rem] leading-relaxed text-ink-mid [&_b]:font-semibold [&_b]:text-ink">{bridge}</div>
      <div className="mt-1 border-t-2 border-ink pt-2">
        <div className="text-[0.6875rem] font-semibold uppercase tracking-wider text-ink-faint">{outcome.key}</div>
        <div className="text-2xl font-bold tabular-nums" style={{ color: TONE[outcome.tone] }}>{outcome.val}</div>
        <div className="mt-0.5 text-[0.6875rem] text-ink-faint">{outcome.sub}</div>
      </div>
    </div>
  );
}

function AmendBox({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="ml-3.5 border-l-2 px-3 py-2.5" style={{ borderColor: "#5a3a7a", background: tint("#5a3a7a", 8) }}>
      <div className="mb-1.5 text-[0.6875rem] font-bold uppercase tracking-wide" style={{ color: "#5a3a7a" }}>{label}</div>
      {children}
    </div>
  );
}
function AmendItem({ name, change, saves, vote }: { name: string; change: string; saves: string; vote: string }) {
  return (
    <div className="border-t border-black/10 py-2 first:border-t-0 first:pt-0">
      <span className="block text-[0.84375rem] font-semibold text-ink">{name}</span>
      <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 text-[0.78125rem] tabular-nums">
        <span className="text-ink-mid">{change}</span>
        <span className="font-semibold text-accent">{saves}</span>
        <span className="text-ink-faint">{vote}</span>
      </div>
    </div>
  );
}

/* ---------- data ---------- */
const DEBT_ROWS: { y: string; ex: string; l1: string; l2: string; other: string; total: string; pct: string; now?: boolean; proj?: boolean; hi?: boolean; bold?: boolean }[] = [
  { y: "FY2026", ex: "$6.87M", l1: "$0.53M", l2: "–", other: "$1.39M", total: "$8.79M", pct: "5.06%" },
  { y: "FY2027 (this budget)", ex: "$6.67M", l1: "$2.00M", l2: "–", other: "$0.30M", total: "$8.97M", pct: "5.01%", now: true, bold: true },
  { y: "FY2028", ex: "$6.38M", l1: "$1.40M", l2: "$1.00M", other: "$0.40M", total: "$9.18M", pct: "5.00%" },
  { y: "FY2029 (projected)", ex: "$6.16M", l1: "$1.02M", l2: "$0.74M", other: "$1.55M", total: "$9.47M", pct: "5.01%", proj: true },
  { y: "FY2030 (projected)", ex: "$5.98M", l1: "$1.00M", l2: "$0.73M", other: "$2.05M", total: "$9.75M", pct: "5.02%", proj: true },
  { y: "FY2031 (projected)", ex: "$5.81M", l1: "$0.97M", l2: "$0.71M", other: "$2.53M", total: "$10.02M", pct: "4.98%", proj: true },
  { y: "FY2032 (projected)", ex: "$5.65M", l1: "$0.95M", l2: "$0.70M", other: "$3.33M", total: "$10.62M", pct: "5.10%", proj: true },
  { y: "FY2033 (projected)", ex: "$5.53M", l1: "$0.93M", l2: "$0.68M", other: "$8.32M", total: "$15.46M", pct: "7.18%", proj: true, hi: true, bold: true },
];

const NOTES: React.ReactNode[] = [
  <>Will Dowd, <ExtA href="https://www.marbleheadindependent.com/marblehead-voters-approve-15m-override-ending-more-than-two-decades-of-resistance/">Marblehead Independent, June 9, 2026</ExtA>: Marblehead voters approved a $15 million operating override, 54.3% to 45.7%, the first since 2005.</>,
  <>The abatement reserve (the &quot;overlay&quot; in state law) is required under Massachusetts General Laws Chapter 59, Section 25: &quot;The assessors of each city or town shall raise by taxation each year a reasonable amount of overlay.&quot; <ExtA href="https://malegislature.gov/Laws/GeneralLaws/PartI/TitleIX/Chapter59/Section25">Full text at malegislature.gov.</ExtA></>,
  <>UGGA background: the Massachusetts Budget and Policy Center and a Boston Globe editorial (December 2025) both document that UGGA has no enrollment or needs formula; each community&apos;s allocation is based on historical amounts from two older programs merged in 2010. <ExtA href="https://www.mass.gov/info-details/understanding-local-government-revenue-sources">Mass.gov overview.</ExtA> <ExtA href="https://www.bostonglobe.com/2025/12/18/opinion/ugga-municipal-aid-formula/">Boston Globe editorial on UGGA reform.</ExtA></>,
  <>Essex Tech assessment methodology: Acts of 2004 Chapter 463 states expenses &quot;shall be apportioned to the member municipalities on the basis of their respective pupil enrollment in the district.&quot; <ExtA href="https://malegislature.gov/Laws/SessionLaws/Acts/2004/Chapter463">Full statute.</ExtA> <ExtA href="https://essexnorthshore.org/admissions/">Essex North Shore admissions.</ExtA></>,
  <>The $176K net increase in debt service is from the <ExtA href="https://www.beverlyma.gov/DocumentCenter/View/7054/Beverly-City-Hall-Renovation-and-Expansion--City-Council-Project-Update--January-20-2026?bidId=">City Hall Renovation presentation to the City Council, January 20, 2026</ExtA>, General Fund Debt Schedule, slide 27.</>,
  <>Option A calculation: at a $100 flat fee, enterprise fund fee revenue stays around $1.27M against $5.27M in costs, so the general fund transfer rises to about $3.81M, an increase of $1.33M over FY26. Added to the $2.88M pre-trash deficit, that is about $4.21M in total cuts needed (rounded to $4.2M). A calculated estimate, not a figure from an official document.</>,
  <>Scott Souza, Patch: <ExtA href="https://patch.com/massachusetts/beverly/proposed-beverly-trash-fee-increase-spurs-fierce-city-council-debate">&quot;Proposed Beverly Trash Fee Increase Spurs Fierce City Council Debate&quot; (May 19, 2026)</ExtA> and <ExtA href="https://patch.com/massachusetts/beverly/beverly-mayor-outlines-staff-cuts-amid-budget-deficit-modified-trash-fee">&quot;Beverly Mayor Outlines Staff Cuts Amid Budget Deficit&quot; (June 2026)</ExtA>. The second confirms the 7-2 vote margin.</>,
  <>City Council budget meeting, June 23, 2026. Meeting notes provided by the City of Beverly. Final vote 5-4: Flowers, Feldman, Houseman, Spang, Rotondo in favor; Sonia, St. Hilaire, Mulladay, Crowley opposed. <ExtA href="https://www.youtube.com/watch?v=nlwByu273SM">Video of the meeting.</ExtA></>,
  <><ExtA href="https://www.beverlyma.gov/DocumentCenter/View/7054/Beverly-City-Hall-Renovation-and-Expansion--City-Council-Project-Update--January-20-2026?bidId=">City of Beverly, &quot;Beverly City Hall Renovation and Expansion, City Council Project Update,&quot; January 20, 2026.</ExtA> Includes the General Fund Debt Schedule (slide 27) and debt management strategy charts (slides 23-25).</>,
  <>The National Grid energy credit ($700K revenue, roughly $588K matching cost) is a passthrough that nets close to zero. It is included in both the $7.2M revenue growth and $10M cost growth headline figures. Excluding it, revenue growth is closer to $6.5M and cost growth closer to $9.4M; the gap between them is essentially unchanged either way.</>,
  <>Massachusetts Division of Local Services, <ExtA href="https://www.mass.gov/info-details/fiscal-stress-the-debt-burden">&quot;Fiscal Stress: The Debt Burden.&quot;</ExtA> DLS sets no fixed acceptable percentage; it describes fiscal stress as appearing &quot;when debt service has impacted the operating budget to where normal public services are affected.&quot; Beverly&apos;s debt service is projected near 5% through FY2032 (see appendix). Quincy figures from the City of Quincy&apos;s own <ExtA href="https://www.quincyma.gov/departments/municipal_finance/charts,_graphs,_and_data.php">&quot;Where Your Tax Dollar Goes&quot; FY26 breakdown</ExtA>: debt service at 19.54% of the FY26 budget and $882 per resident, against Beverly&apos;s roughly $212 per resident. S&amp;P downgraded Quincy&apos;s general obligation rating to AA- in 2025 with a negative outlook; Moody&apos;s issued its own downgrade in spring 2026. Quincy&apos;s jump is driven largely by pension obligation bond payments.</>,
  <>Fee coverage for Beverly&apos;s water and sewer enterprise funds from the Massachusetts Division of Local Services, <ExtA href="https://dlstab.dor.state.ma.us/views/TrendsInEnterprisefunds/TrendsInEnterpriseFunds">&quot;Trends in Enterprise Funds&quot;</ExtA> (FY2025, the most recent year populated). Both funds recovered upward of 90% of their costs through user charges.</>,
];
