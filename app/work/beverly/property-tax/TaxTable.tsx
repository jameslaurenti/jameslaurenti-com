"use client";

import { useMemo, useState } from "react";
import {
  type TaxData,
  type Town,
  DEFAULT_COUNTY,
  SELECT_COLORS,
  yearRecord,
  levyView,
  fmtRate,
  fmtUSD,
  fmtPct,
} from "@/lib/beverly/taxData";

type Props = {
  data: TaxData;
  year: number;
  selected: string[];
};

type Filter = "essex" | "state";
type Dir = "asc" | "desc";

type Col = {
  key: string;
  label: string;
  numeric: boolean;
  value: (t: Town) => number | string | null;
  render: (t: Town) => string;
  align: "left" | "right";
};

export default function TaxTable({ data, year, selected }: Props) {
  const [filter, setFilter] = useState<Filter>("essex");
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("name");
  const [dir, setDir] = useState<Dir>("asc");

  const rec = (t: Town) => yearRecord(t, year);
  const hasLevy = useMemo(() => data.towns.some((t) => t.series.some((s) => s.levy_ceiling != null)), [data]);

  const cols: Col[] = useMemo(
    () => [
      { key: "name", label: "Town", numeric: false, value: (t) => t.name, render: (t) => t.name, align: "left" },
      { key: "county", label: "County", numeric: false, value: (t) => t.county ?? "", render: (t) => t.county ?? "—", align: "left" },
      { key: "rate", label: "Posted rate", numeric: true, value: (t) => rec(t)?.rate ?? null, render: (t) => fmtRate(rec(t)?.rate), align: "right" },
      { key: "effective_rate", label: "Eff. rate", numeric: true, value: (t) => rec(t)?.effective_rate ?? null, render: (t) => fmtPct(rec(t)?.effective_rate, 2), align: "right" },
      { key: "avg_bill", label: "Avg bill", numeric: true, value: (t) => rec(t)?.avg_bill ?? null, render: (t) => fmtUSD(rec(t)?.avg_bill), align: "right" },
      { key: "avg_value", label: "Avg value", numeric: true, value: (t) => rec(t)?.avg_value ?? null, render: (t) => fmtUSD(rec(t)?.avg_value), align: "right" },
      { key: "income", label: "Med. income", numeric: true, value: (t) => rec(t)?.income ?? null, render: (t) => fmtUSD(rec(t)?.income), align: "right" },
      { key: "burden", label: "Burden", numeric: true, value: (t) => rec(t)?.burden ?? null, render: (t) => fmtPct(rec(t)?.burden, 1), align: "right" },
      ...(hasLevy
        ? [{
            key: "pct_ceiling",
            label: "% of ceiling",
            numeric: true,
            value: (t: Town) => levyView(rec(t))?.pctOfCeiling ?? null,
            render: (t: Town) => { const lv = levyView(rec(t)); return lv ? fmtPct(lv.pctOfCeiling, 0) : "—"; },
            align: "right" as const,
          }]
        : []),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [year, hasLevy]
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = data.towns.filter((t) => {
      if (filter === "essex" && t.county !== DEFAULT_COUNTY) return false;
      if (q && !t.name.toLowerCase().includes(q)) return false;
      return true;
    });
    const col = cols.find((c) => c.key === sortKey)!;
    list = [...list].sort((a, b) => {
      const va = col.value(a);
      const vb = col.value(b);
      // nulls always last
      if (va == null && vb == null) return 0;
      if (va == null) return 1;
      if (vb == null) return -1;
      let cmp: number;
      if (col.numeric) cmp = (va as number) - (vb as number);
      else cmp = String(va).localeCompare(String(vb));
      return dir === "asc" ? cmp : -cmp;
    });
    return list;
  }, [data, filter, query, sortKey, dir, cols]);

  const essexCount = useMemo(() => data.towns.filter((t) => t.county === DEFAULT_COUNTY).length, [data]);

  const onSort = (key: string) => {
    if (key === sortKey) setDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setDir(key === "name" || key === "county" ? "asc" : "desc");
    }
  };

  const selColor = (name: string) => SELECT_COLORS[selected.indexOf(name) % SELECT_COLORS.length];

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <div className="inline-flex rounded-md border border-rule p-0.5 text-xs">
          {(["essex", "state"] as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
              className={`rounded px-3 py-1 transition-colors ${filter === f ? "bg-accent text-white" : "text-ink-mid hover:text-ink"}`}
            >
              {f === "essex" ? `Essex (${essexCount})` : "Statewide (351)"}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by town…"
          aria-label="Filter table by town name"
          className="min-w-0 flex-1 rounded-md border border-rule bg-bg-card px-3 py-1.5 text-sm text-ink placeholder:text-ink-faint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
        />
        <span className="text-xs text-ink-faint">
          FY{year} · {rows.length} shown
        </span>
      </div>

      <div className="overflow-x-auto rounded-md border border-rule">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-rule bg-bg-card text-ink-mid">
              {cols.map((c) => (
                <th key={c.key} className={`whitespace-nowrap px-3 py-2 font-medium ${c.align === "right" ? "text-right" : "text-left"}`}>
                  <button
                    type="button"
                    onClick={() => onSort(c.key)}
                    className={`inline-flex items-center gap-1 hover:text-ink ${c.align === "right" ? "flex-row-reverse" : ""}`}
                    aria-label={`Sort by ${c.label}`}
                  >
                    {c.label}
                    <span className="text-[10px] text-ink-faint" aria-hidden>
                      {sortKey === c.key ? (dir === "asc" ? "▲" : "▼") : "↕"}
                    </span>
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {rows.map((t) => {
              const isSel = selected.includes(t.name);
              return (
                <tr
                  key={t.name}
                  className={`border-b border-rule/60 last:border-0 ${isSel ? "bg-accent-glow" : "hover:bg-bg-card/60"}`}
                >
                  {cols.map((c) => {
                    const atCeiling = c.key === "pct_ceiling" && levyView(rec(t))?.atCeiling;
                    return (
                      <td key={c.key} className={`whitespace-nowrap px-3 py-1.5 ${c.align === "right" ? "text-right" : "text-left"} ${c.key === "name" ? "font-medium text-ink" : "text-ink-mid"}`}>
                        {c.key === "name" && isSel ? (
                          <span className="inline-flex items-center gap-1.5">
                            <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: selColor(t.name) }} />
                            {c.render(t)}
                          </span>
                        ) : atCeiling ? (
                          <span className="inline-flex items-center gap-1.5">
                            {c.render(t)}
                            <span className="rounded border border-rule bg-bg px-1 py-0.5 text-[9px] font-medium uppercase tracking-wide text-ink-mid">
                              at ceiling
                            </span>
                          </span>
                        ) : (
                          c.render(t)
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={cols.length} className="px-3 py-6 text-center text-ink-faint">
                  No towns match “{query}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
