/*
  REFERENCE PATTERN, not shipping code.
  Shows how a Beverly component should consume the shared data layer and surface
  confidence, instead of hardcoding figures. Claude Code: adapt to the repo's
  Tailwind v4 tokens, font setup, and routing. See CLAUDE.md.

  Two things this demonstrates:
  1. Data and its provenance come from data/beverly/pension.json, one source of truth.
  2. A figure's `confidence` drives what the UI shows (a source note vs. a "modeled"
     or "illustrative" badge), so a chart can never imply a modeled number is a
     source number.
*/

"use client";

import pension from "@/data/beverly/pension.json"; // [CONFIRM alias in tsconfig]
import {
  ComposedChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ReferenceLine, Label, ResponsiveContainer,
} from "recharts";

// Small helper: render provenance straight from the data record.
// confirmed -> source citation; modeled/illustrative -> a visible marker.
function ConfidenceNote({ meta }) {
  if (meta.confidence === "confirmed") {
    return (
      <p className="text-xs text-warm-gray-600 mt-2">
        Source: {meta.source}
        {meta.pages?.schedule ? `, p.${meta.pages.schedule}` : ""}.
      </p>
    );
  }
  const label = meta.confidence === "modeled" ? "Modeled" : "Illustrative";
  return (
    <span className="inline-block text-[11px] font-semibold uppercase tracking-wide
                     px-2 py-0.5 rounded-full bg-debt/10 text-debt mt-2">
      {label}
    </span>
  );
}

export default function PensionScheduleChart() {
  const { schedule, cliff, _meta } = pension;

  return (
    <figure className="rounded-xl border border-warm-gray-200 bg-white p-6">
      <div className="h-[360px] w-full">
        <ResponsiveContainer>
          <ComposedChart data={schedule} margin={{ top: 30, right: 14, bottom: 4, left: 2 }}>
            <CartesianGrid strokeDasharray="2 4" vertical={false} className="stroke-warm-gray-200" />
            <XAxis dataKey="fy" tickLine={false} />
            <YAxis tickFormatter={(v) => `$${v}M`} domain={[0, 20]} width={46}
                   axisLine={false} tickLine={false} />
            <Tooltip />
            {/* forest = permanent cost, debt token = the amortization that ends */}
            <Area type="monotone" dataKey="permanent" stackId="a"
                  fill="var(--color-forest)" stroke="none" isAnimationActive={false} />
            <Area type="monotone" dataKey="debt" stackId="a"
                  fill="var(--color-debt)" stroke="none" isAnimationActive={false} />
            <ReferenceLine x={cliff.clearedFy} strokeDasharray="4 4">
              <Label value="debt retires" position="top" />
            </ReferenceLine>
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <figcaption>
        <p className="text-sm text-warm-gray-700">
          The debt payment peaks at ${cliff.peakTotal}M in {cliff.peakFy}, then clears
          by {cliff.clearedFy}, freeing about ${cliff.annualReliefApprox}M a year.
        </p>
        {/* Provenance rendered from the same record the numbers came from. */}
        <ConfidenceNote meta={_meta} />
      </figcaption>
    </figure>
  );
}

/*
  Notes for the port:
  - Token names (--color-forest, --color-debt, bg-warm-gray-*) are placeholders.
    Match them to the repo @theme block, or add them there if missing.
  - The scenario chart in the full piece should read fundedRatioScenarios and use
    its `firm` flag to draw the "projection ends, rest illustrative" divider, and its
    `confidence: "mixed"` note verbatim. That keeps the illustrative extension
    honestly labeled.
*/
