"use client";

// Minimal sparkline: one line across the full FY range, scaled to its own
// min/max, with gaps left as breaks and a dot on the latest point.

type Point = { fy: number; v: number | null };

export default function Sparkline({
  points,
  color,
  width = 180,
  height = 44,
}: {
  points: Point[];
  color: string;
  width?: number;
  height?: number;
}) {
  const vals = points.filter((p) => p.v != null).map((p) => p.v as number);
  const n = points.length;

  if (vals.length < 2 || n < 2) {
    return <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }} aria-hidden />;
  }

  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const pad = (max - min) * 0.14 || Math.abs(max) * 0.1 || 1;
  const lo = min - pad;
  const hi = max + pad;

  const x = (i: number) => 3 + i * ((width - 6) / (n - 1));
  const y = (v: number) => height - 4 - ((v - lo) / (hi - lo)) * (height - 8);

  let d = "";
  let pen = false;
  points.forEach((p, i) => {
    if (p.v == null) {
      pen = false;
      return;
    }
    d += `${pen ? "L" : "M"}${x(i).toFixed(1)} ${y(p.v).toFixed(1)} `;
    pen = true;
  });

  let lastIdx = -1;
  for (let i = points.length - 1; i >= 0; i--) {
    if (points[i].v != null) {
      lastIdx = i;
      break;
    }
  }

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ height }} aria-hidden>
      <path d={d.trim()} fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
      {lastIdx >= 0 && <circle cx={x(lastIdx)} cy={y(points[lastIdx].v as number)} r={2.6} fill={color} />}
    </svg>
  );
}
