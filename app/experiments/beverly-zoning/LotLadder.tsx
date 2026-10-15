"use client";

import { useRef } from "react";
import { useChartScale } from "@/lib/beverly/useChartScale";
import { DISTRICTS, ZONE_FILL, fmt } from "./zoning";

/**
 * The minimum lot of each one- and two-family district, drawn to scale as nested squares that
 * share a corner. The biggest is the R-90 lot, 300 feet on a side.
 */

const ZONES = ["R90", "R45", "R22", "R15", "R10", "R6"];
const W = 360;
const H = 350;
const PAD = 14;
const SCALE = (W - 2 * PAD - 10) / 300; // px per foot; R-90 is 300 ft square

export default function LotLadder() {
  const ref = useRef<SVGSVGElement>(null);
  // Labels keep a readable size when the figure is squeezed onto a phone.
  const { fs } = useChartScale(ref, W);
  const squares = ZONES.map((z) => {
    const sqft = DISTRICTS[z].minLotSqft?.value ?? 0;
    const side = Math.sqrt(sqft) * SCALE;
    return { z, sqft, side, code: DISTRICTS[z].code };
  });
  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`Minimum lot sizes drawn to scale: ${squares
        .map((s) => `${s.code}, ${fmt(s.sqft)} square feet`)
        .join("; ")}.`}
      className="block h-auto w-full max-w-[460px]"
    >
      {squares.map((s) => (
        <rect
          key={s.z}
          x={PAD}
          y={H - PAD - s.side}
          width={s.side}
          height={s.side}
          fill={ZONE_FILL[s.z]}
          stroke="#6b6055"
          strokeWidth={1}
        />
      ))}
      {squares.map((s) => (
        <text
          key={`${s.z}-l`}
          x={PAD + s.side - 5}
          y={H - PAD - s.side + fs(11) + 3}
          textAnchor="end"
          fontSize={fs(11)}
          fill="#1a1815"
        >
          <tspan fontWeight={700}>{s.code}</tspan>
          <tspan> {fmt(s.sqft)}</tspan>
        </text>
      ))}
      <text x={PAD} y={H - 2} fontSize={fs(10)} fill="#4d4840">
        Street side
      </text>
    </svg>
  );
}
